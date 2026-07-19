const jwt = require('jsonwebtoken');
const userModel = require('./../../modules/users/model/User');
const mongoose = require('mongoose');


module.exports = async (req, res, next) => {
    try {
        const token = req.cookies['access-token'];

        if (!token) {
            req.flash('error', 'Please Login First')
            return res.redirect('/auth/login')
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload) {
            req.flash('error', 'Please Login First')
            return res.redirect('/auth/login')

        }

        const userID = payload.userID;

        const user = await userModel.findOne({ _id: new mongoose.Types.ObjectId(userID) }).lean();
        
        
        if (!user) {
            req.flash('error', 'Please Login First')
            return res.redirect('/auth/login')

        }

        Reflect.deleteProperty(user, 'password');
        
        req.user = user;

        next()
    } catch (error) {
        next(error)
    }
}