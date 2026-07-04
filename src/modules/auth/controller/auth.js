const { errorHandler } = require('./../../../utils/middlewares/errorHandler');
const responseHandler = require('./../../../utils/responses');
const userModel = require('./../../users/model/User');
const refreshTokenModel = require('./../../token/refresh_token/model/refreshToken');
const userRegisterValidationSchema = require('./../../../utils/validators/registerUserValidator');
const userLoginValidationSchema = require('./../../../utils/validators/loginUserValidator')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.showRegisterView = async (req, res) => {
    return res.render('./Pages/Auth/Register/index')
};


exports.register = async (req, res) => {
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
        responseHandler.errorResponse(res, 400, error, { error })
        // next(error)
    }
}

exports.showLoginView = async (req, res) => {
    return res.render('./Pages/Auth/Login/index')
};

exports.login = async (req, res) => {
    const { email, password } = req.body;


    await userLoginValidationSchema.validate({email, password}, {abortEarly: false});

    
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
};