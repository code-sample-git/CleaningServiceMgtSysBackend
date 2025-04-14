const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { authenticate, restrictTo } = require('../middleware/auth');

router.post('/', authenticate, proposalController.createProposal);
router.get('/client/:clientId', authenticate, proposalController.getProposalsByClient);
router.get('/:id', authenticate, proposalController.getProposalById);
router.put('/:id', authenticate, restrictTo('manager', 'admin'), proposalController.updateProposal);
router.patch('/:id/status', authenticate, restrictTo('manager', 'admin'), proposalController.updateProposalStatus);
router.delete('/:id', authenticate, restrictTo('manager', 'admin'), proposalController.deleteProposal);
router.post('/:id/email', authenticate, restrictTo('manager', 'admin'), proposalController.sendProposalEmail);

module.exports = router;
