const Player = require('../models/Player');
const Match = require('../models/Match');

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.id });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching player',
      error: error.message
    });
  }
};

// Search players by name
exports.searchPlayers = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Player name is required'
      });
    }

    const players = await Player.find({
      playerName: { $regex: name, $options: 'i' }
    }).limit(10);

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching players',
      error: error.message
    });
  }
};

// Get player match history
exports.getPlayerMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const matches = await Match.find({ playerId: id })
      .sort({ matchDate: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Match.countDocuments({ playerId: id });

    res.json({
      success: true,
      count: matches.length,
      total,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match history',
      error: error.message
    });
  }
};
