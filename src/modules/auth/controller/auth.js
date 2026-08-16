const { errorHandler } = require('./../../../utils/middlewares/errorHandler');
const responseHandler = require('./../../../utils/responses');
const userModel = require('./../../users/model/User');
const refreshTokenModel = require('./../../token/refresh_token/model/refreshToken');
const resetPasswordModel = require('./../../resetPassword/model/resetPassword');
const userRegisterValidationSchema = require('./../../../utils/validators/registerUserValidator');
const userLoginValidationSchema = require('./../../../utils/validators/loginUserValidator');
const forgetPasswordValidationSchema = require('./../../../utils/validators/forgetPasswordValidator');
const resetPasswordValidationSchema = require('./../../../utils/validators/resetPasswordValidator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');          //reset pass token
const nodeMailer = require('nodemailer');

exports.showRegisterView = async (req, res) => {
    return res.render('./Pages/Auth/Register/index')
};


exports.register = async (req, res, next) => {
    try {
        const { email, username, password, name } = req.body;


        //Validation
        await userRegisterValidationSchema.validate({
            email,
            username,
            password,
            name
        }, {
            abortEarly: false                 //abortEarly: false => determines that validate all properties and then return an array of errors
        });

        const isUserExist = await userModel.findOne({ $or: [{ username }, { email }] }).lean();

        if (isUserExist) {
            req.flash('error', 'Email or Username Already Exist')

            return res.redirect('/auth/register')
            // return responseHandler.errorResponse(res, 400, 'Email or Username Already Exist',{})
        };

        const isFirstUser = (await userModel.countDocuments({})) === 0;
        let role = 'USER'
        if (isFirstUser) {
            role = 'ADMIN'
        };

        const newUser = new userModel({ email, username, name, password, role });

        await newUser.save();

        const accessToken = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30day'
        });

        const refreshToken = await refreshTokenModel.createToken(newUser);




        res.cookie('access-token', accessToken, { maxAge: 900_000_000, httpOnly: true });
        res.cookie('refresh-token', refreshToken, { maxAge: 900_000_000, httpOnly: true });

        req.flash('success', 'Registration Successfull')

        return res.redirect('/auth/register')
        // return responseHandler.successResponse(res, 201, { message: 'User created successfully', user: { ...newUser.toObject() , password: undefined } })
    } catch (error) {

        next(error)
        // responseHandler.errorResponse(res, 400, error, { error })
    }
}

exports.showLoginView = async (req, res) => {
    return res.render('./Pages/Auth/Login/index')
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        await userLoginValidationSchema.validate({ email, password }, { abortEarly: false });


        const user = await userModel.findOne({ email }).lean();

        if (!user) {
            req.flash('error', 'Invalid Email or Password')

            return res.redirect('/auth/login')
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            req.flash('error', 'Invalid Email or Password')

            return res.redirect('/auth/login')
        };



        const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30day'
        });

        const refreshToken = await refreshTokenModel.createToken(user);




        res.cookie('access-token', accessToken, { maxAge: 900_000_000, httpOnly: true });
        res.cookie('refresh-token', refreshToken, { maxAge: 900_000_000, httpOnly: true });

        req.flash('success', 'Login Successfull')

        return res.redirect('/auth/login')
    } catch (error) {
        next(error)

    }
};


exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refresh-token'];

        if (!refreshToken) {
            req.flash('error', 'refresh token not found.login again')

            return res.redirect('/auth/login')
        }
        const userID = await refreshTokenModel.verifyToken(refreshToken);

        if (!userID) {
            req.flash('error', 'user id not found.login again')

            return res.redirect('/auth/login')
        };

        await refreshTokenModel.findOneAndDelete({ token: refreshToken });

        const user = await userModel.findOne({ _id: userID });

        if (!user) {
            req.flash('error', 'user not found.login again')

            return res.redirect('/auth/login')
        };

        const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30day'
        });

        const newRefreshToken = await refreshTokenModel.createToken(user);

        res.cookie('access-token', accessToken, {
            maxAge: 900_000_000,
            httpOnly: true
        });

        res.cookie('refresh-token', newRefreshToken, {
            maxAge: 900_000_000,
            httpOnly: true
        });

    } catch (error) {
        next(error)
    }
};

exports.showForgetPasswordView = async (req, res, next) => {
    try {
        return res.render('./Pages/Auth/Recovery/forgetPassword')
    } catch (error) {
        next(error)
    }
};

exports.forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        await forgetPasswordValidationSchema.validate({ email });

        const user = await userModel.findOne({ email });
        if (!user) {
            req.flash('error', 'User Not Found')

            return res.redirect('/auth/forget-password')
        };

        const resetToken = crypto.randomBytes(32).toString('hex');

        const resetTokenExpireTime = Date.now() + (1000 * 60 * 3);

        const resetPassword = new resetPasswordModel({
            user: user._id,
            token: resetToken,
            tokenExpireTime: resetTokenExpireTime
        });

        await resetPassword.save();

        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'souri7205@gmail.com',
                pass: 'woqf xyqt cyba lumm'
            }
        });

        const mailOptions = {
            from: 'souri7205@gmail.com',
            to: email,
            subject: 'Reset Password Link (social project)',
            html: `   
            <h2>Hi ${user.name}, link has 3 minutes expire time</h2>
            <a href=http://localhost:${process.env.PORT}/auth/reset-password/${resetToken}> >Reset Password</a>`   //use html prop instead text to render html tags
        };

        transporter.sendMail(mailOptions);

        req.flash('success', 'reset password link sent to your email! ')

        return res.redirect(req.headers.referer)

    } catch (error) {
        next(error)
    }
};

exports.showResetPasswordView = async (req, res, next) => {
    try {
        return res.render('./Pages/Auth/Recovery/resetPassword')
    } catch (error) {
        next(error)
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { password, token } = req.body;

        await resetPasswordValidationSchema.validate({ token, password }, { abortEarly: false });


        const resetPassword = await resetPasswordModel.findOne({
            token,
            tokenExpireTime: { $gt: Date.now() }
        });

        if (!resetPassword) {
            req.flash('error', 'Invalid or Expired Token')

            return res.redirect(req.headers.referer)
        };

        const user = await userModel.findOne({ _id: resetPassword.user });

        if (!user) {
            req.flash('error', 'can not find user from resetpassword')

            return res.redirect(req.headers.referer)
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.findOneAndUpdate({_id: user._id}, {
            password: hashedPassword
        });

        await resetPasswordModel.findOneAndDelete({_id: resetPassword._id});

            
        req.flash('success', 'Password reset successfully')

        return res.redirect(req.headers.referer)
        
    } catch (error) {
        next(error)
    }
};