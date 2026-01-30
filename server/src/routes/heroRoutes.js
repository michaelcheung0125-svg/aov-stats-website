const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

// Get all heroes
router.get('/', heroController.getAllHeroes);

// Get hero stats with filtering
router.get('/stats', heroController.getHeroStats);

// Get single hero by ID
router.get('/:id', heroController.getHeroById);

module.exports = router;
