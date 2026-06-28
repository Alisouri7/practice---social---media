const express = require('express');
const router = express.Router();
const authController = require('./../controller/auth');

router.route('/register').post(authController.register)


module.exports = router;