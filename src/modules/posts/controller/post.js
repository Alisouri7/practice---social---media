const postModel = require('./../model/Post');
const createPostValidator = require('./../../../utils/validators/createPostValidator');
const hasAccessToPage = require('./../../../utils/hasAccessToPage');
const likeModel = require('./../../like/model/Like');
const saveModel = require('./../../save/model/Save');
const mongoose = require('mongoose');

exports.showPostUploadView = async (req, res) => {
    return res.render('./Pages/PostUpload/index')
};

exports.createPost = async (req, res, next) => {
    try {
        const { description, hashtags } = req.body;
        const user = req.user;
        const tags = hashtags.split(',');

        if (!req.file) {
            req.flash('error', 'Media is required')
            return res.redirect('/posts')
        }

        await createPostValidator.validate({ description }, { abortEarly: false });


        //create new post
        const mediaUrlPath = `/images/posts/${req.file.filename}`

        const post = new postModel({
            media: {
                path: mediaUrlPath,
                filename: req.file.filename
            },
            description,
            hashtags: tags,
            user: req.user._id
        });

        await post.save();

        req.flash('success', 'Post Created Successfully:)')
        return res.redirect('/posts')

    } catch (error) {
        next(error)
    }
};

exports.like = async (req, res, next) => {
    try {

        const user = req.user;
        const { postID } = req.body;

        const post = await postModel.findOne({ _id: postID }).lean();

        if (!post) {
            req.flash('error', 'Post Not Found!')
            return res.redirect(req.get('Referer'))
        };

        const hasAccess = await hasAccessToPage(user._id, post.user);

        if (!hasAccess) {
            req.flash('error', 'You Dont Have Access To This Page!')
            return res.redirect(req.get('Referer'))
        };

        const isLikeExist = await likeModel.findOne({ user: user._id, post: postID }).lean();

        if (isLikeExist) {
            return res.redirect(req.get('referer'))
        };

        const like = new likeModel({
            post: postID,
            user: user._id
        });

        await like.save();

        return res.redirect(req.get('Referer'))
    } catch (error) {
        next(error)
    }
};

exports.dislike = async (req, res, next) => {
    try {
        const user = req.user;
        const { postID } = req.body;

        const like = await likeModel.findOne({ user: user._id, post: postID }).lean();

        if (!like) {
            return res.redirect(req.get('Referer'))
        };

        await likeModel.findOneAndDelete({ _id: like._id }).lean();

        return res.redirect(req.get('Referer'))

    } catch (error) {
        next(error)
    }
};

exports.save = async (req, res, next) => {
    try {
        const user = req.user;
        const { postID } = req.body;

        const post = await postModel.findOne({ _id: postID }).lean();

        if (!post) {
            req.flash('error', 'Post Not Found!')
            return res.redirect(req.get('Referer'))
        };

        const hasAccess = await hasAccessToPage(user._id, post.user);

        if (!hasAccess) {
            req.flash('error', 'You Dont Have Access To This Page!')
            return res.redirect(req.get('Referer'))
        };

        const isSaveExist = await saveModel.findOne({ user: user._id, post: postID }).lean();

        if (isLikeExist) {
            return res.redirect(req.get('referer'))
        };

        const save = new saveModel({
            post: postID,
            user: user._id
        });

        await save.save();

        return res.redirect(req.get('Referer'))

    } catch (error) {
        next(error)
    }
};

exports.unsave = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}