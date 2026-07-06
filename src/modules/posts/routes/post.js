const express = require('express');
const router = express.Router();
const postController = require('./../controller/post');
const authMiddleware = require('./../../../utils/middlewares/auth');
const isAccountVerifiedMiddleware = require('./../../../utils/middlewares/isAccountVerified');

router.route('/')
    .get(authMiddleware, isAccountVerifiedMiddleware, postController.showPostUploadView)
    .post(authMiddleware, postController.createPost);

module.exports = router;