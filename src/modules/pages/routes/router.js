const express = require('express');
const router = express.Router();
const pageCpntroller = require('./../controller/page');
const authMiddleware = require('./../../../utils/middlewares/auth');

router.route('/:pageID').get(authMiddleware, pageCpntroller.getPage)

module.exports = router;