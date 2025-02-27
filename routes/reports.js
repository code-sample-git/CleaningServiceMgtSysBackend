const express = require('express');
const router = express.Router();
const qaReportController = require('../controllers/qaReportController');
const { authenticate, restrictTo } = require('../middleware/auth');

// Only authenticated managers can create reports
router.post('/', authenticate, restrictTo('manager'), qaReportController.createReport);
// Authenticated users can generate PDF reports
router.get('/:id/pdf', authenticate, qaReportController.generatePDFReport);

module.exports = router;