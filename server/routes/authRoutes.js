const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const protect = require('../middleware/protect');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
