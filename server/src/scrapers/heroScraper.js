const axios = require('axios');
const cheerio = require('cheerio');
const Hero = require('../models/Hero');
const HeroStats = require('../models/HeroStats');
const { delay } = require('./utils/parser');

/**
 * Scrape hero data from Arena of Valor Wiki
 */
const scrapeHeroesFromWiki = async () => {
  try {
    console.log('Starting hero scraping from Arena of Valor Wiki...');

    const url = 'https://arenaofvalor.fandom.com/wiki/List_of_heroes';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const heroes = [];

    // Find hero tables or lists
    $('.wikitable tr').each((index, element) => {
      if (index === 0) return; // Skip header row

      const $row = $(element);
      const $cells = $row.find('td');

      if ($cells.length >= 3) {
        const name = $cells.eq(0).text().trim();
        const role = $cells.eq(1).text().trim();
        const imageUrl = $cells.eq(0).find('img').attr('src') || '';

        if (name && role) {
          heroes.push({
            heroId: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            nameEn: name,
            role: mapRole(role),
            difficulty: Math.floor(Math.random() * 5) + 1, // Placeholder
            imageUrl: imageUrl,
            skills: []
          });
        }
      }
    });

    console.log(`Found ${heroes.length} heroes`);
    return heroes;
  } catch (error) {
    console.error('Error scraping heroes from Wiki:', error.message);
    return [];
  }
};

/**
 * Scrape hero data from SAMURAI GAMERS
 */
const scrapeHeroesFromSamurai = async () => {
  try {
    console.log('Starting hero scraping from SAMURAI GAMERS...');

    const url = 'https://samurai-gamers.com/arena-of-valor/database/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const heroes = [];

    // Parse hero cards or lists
    $('.hero-card, .character-card').each((index, element) => {
      const $card = $(element);
      const name = $card.find('.hero-name, .character-name').text().trim();
      const role = $card.find('.hero-role, .character-role').text().trim();
      const imageUrl = $card.find('img').attr('src') || '';

      if (name) {
        heroes.push({
          heroId: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          nameEn: name,
          role: mapRole(role),
          difficulty: Math.floor(Math.random() * 5) + 1,
          imageUrl: imageUrl,
          skills: []
        });
      }
    });

    console.log(`Found ${heroes.length} heroes from SAMURAI GAMERS`);
    return heroes;
  } catch (error) {
    console.error('Error scraping heroes from SAMURAI GAMERS:', error.message);
    return [];
  }
};

/**
 * Map role names to standard format
 */
const mapRole = (role) => {
  const roleMap = {
    'warrior': 'Warrior',
    'tank': 'Tank',
    'assassin': 'Assassin',
    'mage': 'Mage',
    'marksman': 'Marksman',
    'support': 'Support',
    'fighter': 'Warrior',
    'adc': 'Marksman',
    'jungler': 'Assassin'
  };

  const normalized = role.toLowerCase().trim();
  return roleMap[normalized] || 'Warrior';
};

/**
 * Generate sample hero stats
 */
const generateSampleStats = (heroId) => {
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Challenger', 'All'];
  const stats = [];

  ranks.forEach(rank => {
    stats.push({
      heroId: heroId,
      rank: rank,
      winRate: Math.random() * 15 + 45, // 45-60%
      pickRate: Math.random() * 20 + 5, // 5-25%
      banRate: Math.random() * 30, // 0-30%
      avgKDA: Math.random() * 3 + 2, // 2-5
      gamesPlayed: Math.floor(Math.random() * 10000) + 1000,
      lastUpdated: new Date()
    });
  });

  return stats;
};

/**
 * Save heroes to database
 */
const saveHeroesToDB = async (heroes) => {
  try {
    console.log('Saving heroes to database...');

    for (const heroData of heroes) {
      await Hero.findOneAndUpdate(
        { heroId: heroData.heroId },
        heroData,
        { upsert: true, new: true }
      );

      // Generate and save sample stats
      const stats = generateSampleStats(heroData.heroId);
      for (const stat of stats) {
        await HeroStats.findOneAndUpdate(
          { heroId: stat.heroId, rank: stat.rank },
          stat,
          { upsert: true, new: true }
        );
      }

      await delay(100); // Rate limiting
    }

    console.log(`Successfully saved ${heroes.length} heroes to database`);
  } catch (error) {
    console.error('Error saving heroes to database:', error.message);
    throw error;
  }
};

/**
 * Main scraping function
 */
const scrapeHeroes = async () => {
  try {
    console.log('Starting hero data scraping...');

    // Try multiple sources
    let heroes = await scrapeHeroesFromWiki();

    if (heroes.length === 0) {
      console.log('Wiki scraping failed, trying SAMURAI GAMERS...');
      heroes = await scrapeHeroesFromSamurai();
    }

    // If scraping fails, use fallback data
    if (heroes.length === 0) {
      console.log('All scraping attempts failed, using fallback data...');
      heroes = getFallbackHeroes();
    }

    // Save to database
    await saveHeroesToDB(heroes);

    console.log('Hero scraping completed successfully!');
    return heroes;
  } catch (error) {
    console.error('Error in hero scraping:', error.message);
    throw error;
  }
};

/**
 * Fallback hero data
 */
const getFallbackHeroes = () => {
  return [
    { heroId: 'valhein', name: 'Valhein', nameEn: 'Valhein', role: 'Marksman', difficulty: 1, imageUrl: '', skills: [] },
    { heroId: 'arthur', name: 'Arthur', nameEn: 'Arthur', role: 'Warrior', difficulty: 1, imageUrl: '', skills: [] },
    { heroId: 'butterfly', name: 'Butterfly', nameEn: 'Butterfly', role: 'Assassin', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'krixi', name: 'Krixi', nameEn: 'Krixi', role: 'Mage', difficulty: 2, imageUrl: '', skills: [] },
    { heroId: 'thane', name: 'Thane', nameEn: 'Thane', role: 'Tank', difficulty: 2, imageUrl: '', skills: [] },
    { heroId: 'alice', name: 'Alice', nameEn: 'Alice', role: 'Support', difficulty: 2, imageUrl: '', skills: [] },
    { heroId: 'violet', name: 'Violet', nameEn: 'Violet', role: 'Marksman', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'zanis', name: 'Zanis', nameEn: 'Zanis', role: 'Warrior', difficulty: 2, imageUrl: '', skills: [] },
    { heroId: 'nakroth', name: 'Nakroth', nameEn: 'Nakroth', role: 'Assassin', difficulty: 5, imageUrl: '', skills: [] },
    { heroId: 'diaochan', name: 'Diaochan', nameEn: 'Diaochan', role: 'Mage', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'grakk', name: 'Grakk', nameEn: 'Grakk', role: 'Tank', difficulty: 2, imageUrl: '', skills: [] },
    { heroId: 'annette', name: 'Annette', nameEn: 'Annette', role: 'Support', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'tel-annas', name: 'Tel\'Annas', nameEn: 'Tel\'Annas', role: 'Marksman', difficulty: 2, imageUrl: '', skills: [] },
    { heroId: 'lu-bu', name: 'Lu Bu', nameEn: 'Lu Bu', role: 'Warrior', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'murad', name: 'Murad', nameEn: 'Murad', role: 'Assassin', difficulty: 5, imageUrl: '', skills: [] },
    { heroId: 'tulen', name: 'Tulen', nameEn: 'Tulen', role: 'Mage', difficulty: 4, imageUrl: '', skills: [] },
    { heroId: 'arum', name: 'Arum', nameEn: 'Arum', role: 'Tank', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'sephera', name: 'Sephera', nameEn: 'Sephera', role: 'Support', difficulty: 3, imageUrl: '', skills: [] },
    { heroId: 'elsu', name: 'Elsu', nameEn: 'Elsu', role: 'Marksman', difficulty: 5, imageUrl: '', skills: [] },
    { heroId: 'florentino', name: 'Florentino', nameEn: 'Florentino', role: 'Warrior', difficulty: 5, imageUrl: '', skills: [] }
  ];
};

module.exports = {
  scrapeHeroes,
  scrapeHeroesFromWiki,
  scrapeHeroesFromSamurai,
  saveHeroesToDB
};
