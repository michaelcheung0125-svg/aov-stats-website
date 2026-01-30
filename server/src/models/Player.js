const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  playerName: {
    type: String,
    required: true
  },
  server: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  winRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalGames: {
    type: Number,
    required: true
  },
  wins: {
    type: Number,
    required: true
  },
  losses: {
    type: Number,
    required: true
  },
  avgKDA: {
    type: Number,
    required: true
  },
  favoriteHeroes: [{
    heroId: String,
    gamesPlayed: Number,
    winRate: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
