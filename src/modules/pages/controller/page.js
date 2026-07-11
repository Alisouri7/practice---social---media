const hasAccessToPage = require("./../../../utils/hasAccessToPage");
const followModel = require('./../../follower/model/Follower');
const userModel = require('./../../users/model/User');
const mongoose = require('mongoose');

exports.getPage = async (req, res, next) => {
    try {
        const userID = req.user._id.toString();

        const { pageID } = req.params;

        const hasAccess = await hasAccessToPage(userID, pageID);

        const followStatus = await followModel.findOne({ follower: userID, following: pageID }).lean();

        if (!hasAccess) {
            req.flash('error', 'Follow Page To Show Content')
            return res.render('./Pages/Profiles/index', {
                followStatus: Boolean(followStatus),
                pageID
            })
        };

        res.render('./Pages/Profiles/index', {
            followStatus: Boolean(followStatus),
            pageID
        })
    } catch (err) {
        next(err)
    }
}

exports.follow = async (req, res, next) => {
    try {
        const user = req.user;
        const { pageID } = req.params;
 
        const isPageExist = await userModel.findOne({ _id: new mongoose.Types.ObjectId(pageID) }).lean();

        if (!isPageExist) {
            req.flash('error', 'Page Not Found To Follow')
            return res.redirect(`/pages/${pageID}`)
        };

        if (user._id.toString() === pageID) {
            req.flash('error', 'You can not follow your page')
            return res.redirect(`/pages/${pageID}`)
        }
        const isFollowExist = await followModel.findOne({ follower: user._id, following: pageID }).lean();

        if (isFollowExist) {
            req.flash('error', 'Page Already Followed')
            return res.redirect(`/pages/${pageID}`)
        };

        await followModel.create({
            follower: user._id,
            following: pageID
        });

        req.flash('success', 'Page Followed Successfully')
        return res.redirect(`/pages/${pageID}`)
    } catch (error) {
        next(error)
    }
}

exports.unFollow = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}