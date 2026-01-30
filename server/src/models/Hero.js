const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  heroId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  nameEn: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Warrior', 'Tank', 'Assassin', 'Mage', 'Marksman', 'Support']
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5
  },
  imageUrl: {
    type: String
  },
  skills: [{
    name: String,
    description: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);
