const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);

const loginsignupController = require('../controllers/loginsignupController');
const emailverifyController = require('../controllers/emailverifyController');
const forgotpasswordController = require('../controllers/forgotpasswordController');
const profileController = require('../controllers/profileController');
const resetpasswordController = require('../controllers/resetpasswordController');
const socialloginController = require('../controllers/sociallogincontroller');
const socialprofileController = require('../controllers/socialprofileController');

router.post('/signup', loginsignupController.signUp);
router.post('/signin', loginsignupController.signIn);
router.get('/verify/:id', emailverifyController.emailVerify);
router.post('/forgotpassword', forgotpasswordController.forgotPassword);
router.get('/getprofile', passport.authenticate('jwt', { session: false}), profileController.getProfile);
router.post('/resetpassword' , resetpasswordController.resetPassword);
router.post('/sociallogin', socialloginController.socialLogin);
router.post('/socialprofile', passport.authenticate('jwt', { session: false}), socialprofileController.socialProfile);

module.exports = router;