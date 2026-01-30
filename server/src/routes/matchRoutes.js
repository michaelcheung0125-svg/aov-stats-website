const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Get recent matches
router.get('/', matchController.getRecentMatches);

// Get match by ID
router.get('/:id', matchController.getMatchById);

module.exports = router;
