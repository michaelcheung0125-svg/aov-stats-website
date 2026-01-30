const Match = require('../models/Match');

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.id });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match',
      error: error.message
    });
  }
};

// Get recent matches
exports.getRecentMatches = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const matches = await Match.find()
      .sort({ matchDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent matches',
      error: error.message
    });
  }
};
