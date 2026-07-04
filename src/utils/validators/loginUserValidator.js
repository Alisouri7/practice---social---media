const yup = require('yup');


const userLoginValidationSchema = yup.object({
    email: yup.string().email('Please Enter a valid mail').required('Email is required'),
    password: yup.string().min(8, 'Please Enter at least 8 chars').required('Password is required')
});

module.exports = userLoginValidationSchema;