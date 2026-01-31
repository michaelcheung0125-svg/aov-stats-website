require('dotenv').config();
const connectDB = require('../config/database');
const { createSamplePlayers } = require('./playerScraper');

// Connect to database
connectDB().then(async () => {
  try {
    await createSamplePlayers(10);
    console.log('Player scraping completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});
