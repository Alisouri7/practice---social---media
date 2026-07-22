const express = require('express');
const router = express.Router();
const homeController = require('./../controller/controller');

router.route('/').get(homeController.showHomeView);

module.exports = router;