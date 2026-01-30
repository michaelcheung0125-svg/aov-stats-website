const cron = require('node-cron');
const { scrapeHeroes } = require('../scrapers/heroScraper');
const HeroStats = require('../models/HeroStats');

/**
 * Update hero statistics daily
 */
const updateHeroStats = async () => {
  try {
    console.log('Starting daily hero stats update...');

    // Update all hero stats
    const stats = await HeroStats.find();

    for (const stat of stats) {
      // Simulate stat changes (in real app, would scrape new data)
      stat.winRate = Math.max(30, Math.min(70, stat.winRate + (Math.random() - 0.5) * 2));
      stat.pickRate = Math.max(1, Math.min(50, stat.pickRate + (Math.random() - 0.5) * 2));
      stat.banRate = Math.max(0, Math.min(80, stat.banRate + (Math.random() - 0.5) * 3));
      stat.avgKDA = Math.max(1, Math.min(8, stat.avgKDA + (Math.random() - 0.5) * 0.2));
      stat.gamesPlayed += Math.floor(Math.random() * 1000) + 100;
      stat.lastUpdated = new Date();

      await stat.save();
    }

    console.log(`Updated ${stats.length} hero stats`);
  } catch (error) {
    console.error('Error updating hero stats:', error.message);
  }
};

/**
 * Schedule daily updates at 3 AM
 */
const scheduleUpdates = () => {
  // Run every day at 3:00 AM
  cron.schedule('0 3 * * *', async () => {
    console.log('Running scheduled hero stats update...');
    await updateHeroStats();
  });

  console.log('Scheduled daily hero stats update at 3:00 AM');
};

/**
 * Initialize jobs
 */
const initJobs = () => {
  scheduleUpdates();
  console.log('Background jobs initialized');
};

module.exports = {
  updateHeroStats,
  scheduleUpdates,
  initJobs
};
