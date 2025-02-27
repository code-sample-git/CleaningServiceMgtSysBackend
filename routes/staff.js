const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate, restrictTo } = require('../middleware/auth');

// Example routes (adjust as needed)
router.get('/', authenticate, restrictTo('manager'), staffController.getStaff);
router.post('/', authenticate, restrictTo('manager'), staffController.addStaff);

module.exports = router;