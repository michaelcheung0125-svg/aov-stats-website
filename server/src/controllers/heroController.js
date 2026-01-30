const Hero = require('../models/Hero');
const HeroStats = require('../models/HeroStats');

// Get all heroes
exports.getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ name: 1 });
    res.json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching heroes',
      error: error.message
    });
  }
};

// Get single hero by ID
exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findOne({ heroId: req.params.id });

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero not found'
      });
    }

    // Get stats for this hero across all ranks
    const stats = await HeroStats.find({ heroId: req.params.id });

    res.json({
      success: true,
      data: {
        hero,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero',
      error: error.message
    });
  }
};

// Get hero stats with filtering
exports.getHeroStats = async (req, res) => {
  try {
    const { rank = 'All', sortBy = 'winRate', order = 'desc' } = req.query;

    const query = rank === 'All' ? {} : { rank };
    const sortOrder = order === 'desc' ? -1 : 1;

    const stats = await HeroStats.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(100);

    // Populate hero details
    const heroIds = stats.map(stat => stat.heroId);
    const heroes = await Hero.find({ heroId: { $in: heroIds } });

    const heroMap = {};
    heroes.forEach(hero => {
      heroMap[hero.heroId] = hero;
    });

    const enrichedStats = stats.map(stat => ({
      ...stat.toObject(),
      hero: heroMap[stat.heroId]
    }));

    res.json({
      success: true,
      count: enrichedStats.length,
      data: enrichedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero stats',
      error: error.message
    });
  }
};
