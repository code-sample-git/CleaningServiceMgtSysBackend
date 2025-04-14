const express = require('express');
const router = express.Router();
const { getAllTasks, getTaskById } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getAllTasks);
router.get('/:id', authenticate, getTaskById);

module.exports = router;
