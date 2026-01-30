require('dotenv').config();
const connectDB = require('./config/database');
const { scrapeHeroes } = require('./scrapers/heroScraper');

// Connect to database
connectDB().then(async () => {
  try {
    await scrapeHeroes();
    console.log('Hero scraping completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});
