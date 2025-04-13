const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, restrictTo } = require('../middleware/auth');

router.post('/', authenticate, restrictTo('client'), serviceController.createServiceRequest);
router.get('/', serviceController.getServiceRequest);

module.exports = router;