const mongoose = require('mongoose');

const schema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }
}, { timestamps: true });

schema.pre('save', function (next) {
    if (this.parent) {
        this.isReply = true
    }

    next()
});

const model = mongoose.model('Comment', schema);

module.exports = model;