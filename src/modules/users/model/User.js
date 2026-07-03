const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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


schema.pre('save', async () => {
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt)
        // next()
    } catch (error) {
        console.log(error);
        // next(error)
    }
});

const model = mongoose.model('User', schema);

module.exports = model;