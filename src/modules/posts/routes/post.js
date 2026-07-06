const express = require('express');
const router = express.Router();
const postController = require('./../controller/post');
const authMiddleware = require('./../../../utils/middlewares/auth');

router.route('/')
    .get(postController.showPostUploadView)
    .post(authMiddleware, postController.createPost);

module.exports = router;