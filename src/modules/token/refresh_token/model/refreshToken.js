const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    expire: {
        type: Date,
        required: true
    }
}, {timestamps: true});

schema.statics.createToken = async (user) => {

};

schema.statics.verifyToken = async (token) => {

};


const model = mongoose.model('Refresh-Token', schema);

module.exports = model;