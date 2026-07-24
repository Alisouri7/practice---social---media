const express = require('express');
const router = express.Router();
const homeController = require('./../controller/controller');
const authMiddleware = require('./../../../utils/middlewares/auth');

router.route('/').get(authMiddleware ,homeController.showHomeView);

module.exports = router;