const express = require('express');
const router = express.Router();
const userController = require('./../controller/user');
const authMiddleware = require('../../../utils/middlewares/auth');
const { multerUploader } = require('./../../../utils/middlewares/uploaderConfig');

const upload = multerUploader(`${__dirname}/../../../public/images/profiles`, /jpeg|jpg|png|webp|mp4|mkv/);

router.route('/edit-profile').get(authMiddleware, userController.showEditPageView);
router.route('/profile-picture').post(authMiddleware, upload.single('profile'), userController.updateProfile);

module.exports = router;