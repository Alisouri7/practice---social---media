const express = require('express');
const router = express.Router();
const postController = require('./../controller/post');

router.route('/')
    .get(postController.showPostUploadView)
    // .post(postController.createPost);

module.exports = router;