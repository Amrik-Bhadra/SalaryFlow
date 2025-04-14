const express = require('express');
const router = express.Router();
const { 
    logoutController, 
    loginController, 
    verifyOtpController, 
    completeProfile, 
    changePassword, 
    createUserController
} = require('../controllers/auth.controller');

router.post('/createEmployee', createUserController);
router.post('/login', loginController);
router.post('/verifyotp', verifyOtpController);
router.post('/profileComplete', completeProfile);
router.put('/changePassword', changePassword);
router.post('/logout', logoutController);

module.exports = router;