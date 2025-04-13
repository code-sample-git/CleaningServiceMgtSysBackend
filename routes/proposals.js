const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { authenticate, restrictTo } = require('../middleware/auth');