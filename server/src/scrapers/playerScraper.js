const Player = require('../models/Player');
const Match = require('../models/Match');
const { delay } = require('./utils/parser');

/**
 * Generate sample player data
 */
const generateSamplePlayer = (playerId, playerName) => {
  const servers = ['NA', 'EU', 'Asia', 'Latam'];
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Challenger'];

  const totalGames = Math.floor(Math.random() * 500) + 100;
  const wins = Math.floor(totalGames * (Math.random() * 0.3 + 0.4)); // 40-70% win rate
  const losses = totalGames - wins;
  const winRate = (wins / totalGames) * 100;

  return {
    playerId: playerId,
    playerName: playerName,
    server: servers[Math.floor(Math.random() * servers.length)],
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    winRate: winRate,
    totalGames: totalGames,
    wins: wins,
    losses: losses,
    avgKDA: Math.random() * 3 + 2, // 2-5 KDA
    favoriteHeroes: generateFavoriteHeroes(),
    lastUpdated: new Date()
  };
};

/**
 * Generate favorite heroes for a player
 */
const generateFavoriteHeroes = () => {
  const heroIds = ['valhein', 'arthur', 'butterfly', 'krixi', 'violet', 'nakroth', 'diaochan', 'murad'];
  const count = Math.floor(Math.random() * 3) + 3; // 3-5 favorite heroes
  const favorites = [];

  for (let i = 0; i < count; i++) {
    const heroId = heroIds[Math.floor(Math.random() * heroIds.length)];
    const gamesPlayed = Math.floor(Math.random() * 100) + 20;

    favorites.push({
      heroId: heroId,
      gamesPlayed: gamesPlayed,
      winRate: Math.random() * 20 + 45 // 45-65%
    });
  }

  return favorites;
};

/**
 * Generate sample match data for a player
 */
const generateSampleMatches = (playerId, count = 20) => {
  const heroIds = ['valhein', 'arthur', 'butterfly', 'krixi', 'violet', 'nakroth', 'diaochan', 'murad'];
  const matches = [];

  for (let i = 0; i < count; i++) {
    const result = Math.random() > 0.5 ? 'win' : 'loss';
    const kills = Math.floor(Math.random() * 15) + 1;
    const deaths = Math.floor(Math.random() * 10) + 1;
    const assists = Math.floor(Math.random() * 20) + 1;

    matches.push({
      matchId: `match-${playerId}-${Date.now()}-${i}`,
      playerId: playerId,
      heroId: heroIds[Math.floor(Math.random() * heroIds.length)],
      result: result,
      kda: {
        kills: kills,
        deaths: deaths,
        assists: assists
      },
      duration: Math.floor(Math.random() * 600) + 600, // 10-20 minutes
      matchDate: new Date(Date.now() - i * 3600000), // Each match 1 hour apart
      teammates: [],
      opponents: []
    });
  }

  return matches;
};

/**
 * Save player to database
 */
const savePlayerToDB = async (playerData) => {
  try {
    const player = await Player.findOneAndUpdate(
      { playerId: playerData.playerId },
      playerData,
      { upsert: true, new: true }
    );

    // Generate and save sample matches
    const matches = generateSampleMatches(playerData.playerId);
    for (const matchData of matches) {
      await Match.findOneAndUpdate(
        { matchId: matchData.matchId },
        matchData,
        { upsert: true, new: true }
      );
    }

    console.log(`Saved player ${playerData.playerName} with ${matches.length} matches`);
    return player;
  } catch (error) {
    console.error('Error saving player to database:', error.message);
    throw error;
  }
};

/**
 * Scrape player data (placeholder - would need actual data source)
 */
const scrapePlayer = async (playerId, playerName) => {
  try {
    console.log(`Scraping player data for ${playerName}...`);

    // In a real implementation, this would scrape from an actual website
    // For now, we generate sample data
    const playerData = generateSamplePlayer(playerId, playerName);

    await savePlayerToDB(playerData);

    console.log(`Successfully scraped player ${playerName}`);
    return playerData;
  } catch (error) {
    console.error('Error scraping player:', error.message);
    throw error;
  }
};

/**
 * Create sample players for testing
 */
const createSamplePlayers = async (count = 10) => {
  try {
    console.log(`Creating ${count} sample players...`);

    const playerNames = [
      'ProGamer123', 'DragonSlayer', 'NightHunter', 'ShadowBlade', 'PhoenixRising',
      'IceQueen', 'ThunderStrike', 'MysticMage', 'WarriorKing', 'AssassinX',
      'LegendaryPlayer', 'MasterChief', 'EliteSniper', 'DarkKnight', 'GoldenArcher'
    ];

    for (let i = 0; i < count; i++) {
      const playerName = playerNames[i] || `Player${i + 1}`;
      const playerId = `player-${playerName.toLowerCase().replace(/\s+/g, '-')}`;

      await scrapePlayer(playerId, playerName);
      await delay(500); // Rate limiting
    }

    console.log(`Successfully created ${count} sample players`);
  } catch (error) {
    console.error('Error creating sample players:', error.message);
    throw error;
  }
};

module.exports = {
  scrapePlayer,
  createSamplePlayers,
  generateSamplePlayer,
  savePlayerToDB
};
