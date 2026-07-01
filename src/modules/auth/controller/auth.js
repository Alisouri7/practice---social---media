const { errorHandler } = require('./../../../utils/middlewares/errorHandler');
const responseHandler = require('./../../../utils/responses');
const userModel = require('./../../users/model/User');
const userRegisterValidationSchema  = require('./../../../utils/validators/registerUserValidator')
const mongoose = require('mongoose');


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
        
        req.flash('success', 'Registration Successfull')

        return res.redirect('/auth/register')
        // return responseHandler.successResponse(res, 201, { message: 'User created successfully', user: { ...newUser.toObject() , password: undefined } })
    } catch (error) {
        responseHandler.errorResponse(res, 400, error,{error})
        // next(error)
    }
}