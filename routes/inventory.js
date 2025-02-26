const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');

router.get('/low-stock', authMiddleware, inventoryController.getLowStockAlerts);

module.exports = router;