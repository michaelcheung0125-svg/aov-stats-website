import PlayerSearch from '../components/PlayerSearch/PlayerSearch';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Arena of Valor Stats
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Track your performance and climb the ranks
        </p>
        <p className="text-gray-400">
          Search for players, view hero statistics, and explore rankings
        </p>
      </div>

      <PlayerSearch />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-purple-500 hover:border-purple-400 transition-colors duration-200">
          <div className="text-purple-400 text-3xl mb-3">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">Player Stats</h3>
          <p className="text-gray-400">
            View detailed player statistics including win rate, KDA, and favorite heroes
          </p>
        </div>

        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-purple-500 hover:border-purple-400 transition-colors duration-200">
          <div className="text-purple-400 text-3xl mb-3">🎮</div>
          <h3 className="text-xl font-semibold text-white mb-2">Hero Rankings</h3>
          <p className="text-gray-400">
            Explore hero win rates, pick rates, and performance across all ranks
          </p>
        </div>

        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-purple-500 hover:border-purple-400 transition-colors duration-200">
          <div className="text-purple-400 text-3xl mb-3">🏆</div>
          <h3 className="text-xl font-semibold text-white mb-2">Leaderboards</h3>
          <p className="text-gray-400">
            Check out the top players and see where you rank on the leaderboard
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
