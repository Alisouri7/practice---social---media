const yup = require('yup');

const forgetPasswordValidationSchema = yup.object({
    email: yup.string().email('Please Enter a valid mail').required('Email is required')
});

module.exports = forgetPasswordValidationSchema;