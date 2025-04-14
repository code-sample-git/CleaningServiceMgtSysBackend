const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackByProposalId } = require('../controllers/feedbackController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, submitFeedback);
router.get('/proposal/:proposalId', authenticate, getFeedbackByProposalId);

module.exports = router;
