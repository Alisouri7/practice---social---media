
const hasAccessToPage = require("./../../../utils/hasAccessToPage");
const followModel = require('./../../follower/model/Follower');
const userModel = require('./../../users/model/User');
const postModel = require('./../../posts/model/Post');
const likeModel = require('./../../like/model/Like');
const mongoose = require('mongoose');

exports.getPage = async (req, res, next) => {
    try {

        const userID = req.user._id.toString();

        const { pageID } = req.params;

        const hasAccess = await hasAccessToPage(userID, pageID);

        const followStatus = await followModel.findOne({ follower: userID, following: pageID }).lean();


        const page = await userModel.findOne({ _id: pageID }, 'name username biography isVerified profilePicture').lean();



        if (!hasAccess) {
            req.flash('error', 'Follow Page To Show Content')
            return res.render('./Pages/Profiles/index', {
                followStatus: Boolean(followStatus),
                pageID,
                followers: [],
                page,
                followings: [],
                hasAccess: false,
                posts: []
            })
        };


        let followers = await followModel.find({ following: pageID }).populate('follower', 'username name').lean();

        followers = followers.map((item) => {
            return item.follower
        });

        let followings = await followModel.find({ follower: pageID }).populate('following', 'username name').lean();

        followings = followings.map((item) => {
            return item.following
        });

        const posts = await postModel.find({ user: pageID }).populate('user', "name username").lean();

        const likes = await likeModel.find({ user: userID }).lean();

        let postsWithLikes = [];

        // posts.forEach((post) => {
        //     if (likes.length) {
        //         likes.forEach((like) => {
        //             if (like.post.toString() === post._id.toString()) {
        //                 postsWithLikes.push({ ...post, hasLike: true });
        //             } else {
        //                 postsWithLikes.push({ ...post });
        //             }
        //         })
        //     } else {
        //         postsWithLikes = [...posts];
        //     }
        // })

        const likesIDs = new Set(likes.map(like => like.post.toString()));

        postsWithLikes = posts.map(post => {
            return { ...post, hasLike: likesIDs.has(post._id.toString()) }
        });


        const own = userID === pageID;          //showing manage button

        res.render('./Pages/Profiles/index', {
            followStatus: Boolean(followStatus),
            pageID,
            followers,
            page,
            followings,
            hasAccess: true,
            posts: postsWithLikes,
            own
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
        const user = req.user;
        const { pageID } = req.params;

        const unfollowed = await followModel.findOneAndDelete({ follower: user._id, following: new mongoose.Types.ObjectId(pageID) });

        if (!unfollowed) {
            req.flash('error', 'You Didnt Follow This Page')
            return res.redirect(`/pages/${pageID}`)
        };

        req.flash('success', 'Unfollowed Successfully');

        return res.render('./Pages/Profiles/index', {
            followStatus: false,
            pageID
        })
    } catch (error) {
        next(error)
    }
}