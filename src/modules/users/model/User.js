const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { string } = require('yup');

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
        username: {
        type: String,
        required: true,
        unique: true
    },
        biography: {
        type: String
    },
        name: {
        type: String,
        required: true
    },
        password: {
        type: String,
        required: true
    },
        profilePicture: {
        type: String,
        required: false
    },
        role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
        private: {
        type: Boolean,
        default: false,
    },
        isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true});


schema.pre('save', async (next) => {
    try {
        this.password = await bcrypt.hash(this.password, 10)
        // next()
    } catch (error) {
        // next(error)
    }
});

const model = mongoose.model('User', schema);

module.exports = model;