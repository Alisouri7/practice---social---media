const yup = require('yup');

const forgetPasswordValidationSchema = yup.object({
    token: yup.string().required('Reset Token is required'),
    password: yup.string().min(8, 'enter at least 8 chars').required('password required')
});

module.exports = forgetPasswordValidationSchema;