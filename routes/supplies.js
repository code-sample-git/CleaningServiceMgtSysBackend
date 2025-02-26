const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, supplyController.createSupplyRequest);
router.get('/', authMiddleware, supplyController.getSupplyRequests);
router.put('/:id/approve', authMiddleware, supplyController.approveSupplyRequest);
router.put('/:id/reject', authMiddleware, supplyController.rejectSupplyRequest);

module.exports = router;