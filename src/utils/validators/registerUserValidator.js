const yup = require('yup');

const userRegisterValidationSchema = yup.object({
    email: yup.string().email('Please Enter a valid mail').required('Email is required'),
    username: yup.string().min(3, 'Username must be at least 3 characters').required('username is required'),
    name: yup.string().min(3, 'Name must be at least 3 characters').max(36, 'Name can not be more than characters').required('name is required'),
    password: yup.string().min(8, 'Please Enter at least 8 chars').required('Password is required')
});

module.exports = {userRegisterValidationSchema};