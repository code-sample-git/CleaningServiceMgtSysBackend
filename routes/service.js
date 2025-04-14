const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, restrictTo } = require('../middleware/auth');

router.post('/', authenticate, serviceController.createServiceRequest);
router.get('/', authenticate, serviceController.getServiceRequest);
router.get('/:id', authenticate, serviceController.getServiceRequestById);
router.put('/:id', authenticate, serviceController.updateServiceRequest);
router.delete('/:id', authenticate, serviceController.deleteServiceRequest);

module.exports = router;