const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');
const { authenticate, restrictTo } = require('../middleware/auth');

// Authenticated staff/managers can create and view supply requests
router.post('/', authenticate, restrictTo('staff', 'manager'), supplyController.createSupplyRequest);
router.get('/', authenticate, restrictTo('staff', 'manager'), supplyController.getSupplyRequests);
// Only managers can approve/reject supply requests
router.put('/:id/approve', authenticate, restrictTo('manager'), supplyController.approveSupplyRequest);
router.put('/:id/reject', authenticate, restrictTo('manager'), supplyController.rejectSupplyRequest);

module.exports = router;