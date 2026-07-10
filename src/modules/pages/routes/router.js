const express = require('express');
const router = express.Router();
const pageCpntroller = require('./../controller/page');
const authMiddleware = require('./../../../utils/middlewares/auth');

router.route('/:pageID').get(authMiddleware, pageCpntroller.getPage);
router.route('/:pageID/follow').post(authMiddleware, pageCpntroller.follow);
router.route('/:pageID/unfollow').post(authMiddleware, pageCpntroller.unFollow);

module.exports = router;