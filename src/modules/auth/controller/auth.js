const { errorHandler } = require('../../../utils/middlewares/errorHandler');
const { successResponse } = require('../../../utils/responses');
const userModel = require('./../../users/model/User');
const { userRegisterValidationSchema } = require('./../../../utils/validators/registerUserValidator')


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
            return errorHandler(res, 400, 'Email or Username Already Exist',)
        };

        const isFirstUser = (await userModel.countDocument()) === 0;
        let role = 'USER'
        if (isFirstUser) {
            role = 'ADMIN'
        };

        let newUser = new userModel({ email, username, name, password, role });
        await newUser.save();

        return successResponse(res, 201, { message: 'User created successfully', user: { ...newUser, password: undefined } })
    } catch (error) {
        next(error)
    }
}