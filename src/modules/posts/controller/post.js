const postModel = require('./../model/Post');
const createPostValidator = require('./../../../utils/validators/createPostValidator');

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
            return res.render('./Pages/postUpload/index')
        }

        await createPostValidator.validate({description}, {abortEarly: false});


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
        return res.render('./Pges/postUpload/index')

    } catch (error) {
        next(error)
    }
};