const mongoose = require('mongoose');

const heroStatsSchema = new mongoose.Schema({
  heroId: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Challenger', 'All']
  },
  winRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pickRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  banRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  avgKDA: {
    type: Number,
    required: true
  },
  gamesPlayed: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
heroStatsSchema.index({ heroId: 1, rank: 1 }, { unique: true });

module.exports = mongoose.model('HeroStats', heroStatsSchema);
