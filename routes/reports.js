const express = require('express');
const router = express.Router();
const qaReportController = require('../controllers/qaReportController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, qaReportController.createReport);
router.get('/:id/pdf', authMiddleware, qaReportController.generatePDFReport);

module.exports = router;