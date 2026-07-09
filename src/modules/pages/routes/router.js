const express = require('express');
const router = express.Router();
const pageCpntroller = require('./../controller/page');

router.route('/:pageId').get(pageCpntroller.getPage)

module.exports = router;