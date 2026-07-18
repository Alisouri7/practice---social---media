const express = require('express');
const router = express.Router();
const postController = require('./../controller/post');
const authMiddleware = require('./../../../utils/middlewares/auth');
const isAccountVerifiedMiddleware = require('./../../../utils/middlewares/isAccountVerified');
const { multerUploader } = require('./../../../utils/middlewares/uploaderConfig');

const upload = multerUploader(`${__dirname}/../../../public/images/posts`, /jpeg|jpg|png|webp|mp4|mkv/);

router.route('/')
    .get(authMiddleware, isAccountVerifiedMiddleware, postController.showPostUploadView)
    .post(authMiddleware,  upload.single('media'), postController.createPost);

router.route('/like').post(authMiddleware, postController.like);
router.route('/dislike').post(authMiddleware, postController.dislike);

module.exports = router;