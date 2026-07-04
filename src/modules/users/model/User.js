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
}, { timestamps: true });


schema.pre('save', async function () {
    try {

        if (!this.isModified('password')) return;     //hash password only when it changes

        const hashedPassword  = await bcrypt.hash(this.password, 10);
      
        this.password = hashedPassword;
        // next()
    } catch (error) {
        console.log(error);
        throw new Error(error)
        // next(error)
    }
});

const model = mongoose.model('User', schema);

module.exports = model;