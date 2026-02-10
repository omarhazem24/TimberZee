const express = require('express');
const router = express.Router();
const { loginUser, registerUser, verifyOtp, forgotPassword, verifyResetOtp, resetPassword } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
