const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },
  playerId: {
    type: String,
    required: true
  },
  heroId: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true,
    enum: ['win', 'loss']
  },
  kda: {
    kills: {
      type: Number,
      required: true
    },
    deaths: {
      type: Number,
      required: true
    },
    assists: {
      type: Number,
      required: true
    }
  },
  duration: {
    type: Number,
    required: true
  },
  matchDate: {
    type: Date,
    required: true
  },
  teammates: [String],
  opponents: [String]
}, {
  timestamps: true
});

// Index for efficient player match queries
matchSchema.index({ playerId: 1, matchDate: -1 });

module.exports = mongoose.model('Match', matchSchema);
