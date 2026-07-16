const express = require('express');
const router = express.Router();
const userController = require('./../controller/user');

router.route('/edit-profile').get(userController.showEditPageView);

module.exports = router;