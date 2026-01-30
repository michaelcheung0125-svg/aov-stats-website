const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Search players
router.get('/search', playerController.searchPlayers);

// Get player by ID
router.get('/:id', playerController.getPlayerById);

// Get player match history
router.get('/:id/matches', playerController.getPlayerMatches);

module.exports = router;
