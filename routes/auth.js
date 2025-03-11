const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  refreshToken,
} = require('../controllers/authController');
const { authenticate, restrictTo } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', authenticate, restrictTo('admin', 'manager', 'staff', 'client'), getProfile);
router.post('/refresh-token', refreshToken); // Add this line

module.exports = router;