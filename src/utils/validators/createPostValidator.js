const yup = require('yup');

const createPostValidator = yup.object({
    description: yup.string().max(2200 ,'description can not be more than 2200 chars')
})

module.exports = createPostValidator;