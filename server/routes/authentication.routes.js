const express = require('express');
const router = express.Router();
const { 
    logoutController, 
    loginController, 
    verifyOtpController, 
    completeProfile, 
    changePassword, 
    createUserController,
    forgotPasswordController,
    resetPasswordController,
} = require('../controllers/auth.controller');

router.post('/login', loginController);
router.post('/verifyotp', verifyOtpController);
router.post('/forgotpassword', forgotPasswordController);
router.put('/resetpassword', resetPasswordController);

router.post('/createEmployee', createUserController);

router.post('/profileComplete', completeProfile);
router.put('/changePassword', changePassword);
router.post('/logout', logoutController);

module.exports = router;