const express = require('express');
const router = express.Router();
const authController = require('./../controller/auth');

router.route('/register')
    .get(authController.showRegisterView)
    .post(authController.register);


module.exports = router;