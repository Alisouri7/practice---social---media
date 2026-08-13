const express = require('express');
const router = express.Router();
const authController = require('./../controller/auth');

router.route('/register')
    .get(authController.showRegisterView)
    .post(authController.register);

router.route('/login')
    .get(authController.showLoginView)
    .post(authController.login);

router.route('/refresh').get(authController.refreshToken);

router.route('forget-password')
    .get(authController.showForgetPasswordView)
    .post(authController.forgetPassword);


router.route('reset-password/:token').get(authController.showResetPasswordView);

router.route('/reset-password').post(authController.resetPassword);


module.exports = router;