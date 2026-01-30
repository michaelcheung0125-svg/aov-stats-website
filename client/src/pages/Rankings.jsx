import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { playerAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function Rankings() {
  const [server, setServer] = useState('All');

  // In a real app, this would fetch from a rankings endpoint
  // For now, we'll use the search endpoint to get sample players
  const { data, isLoading, error } = useQuery({
    queryKey: ['rankings', server],
    queryFn: async () => {
      // Simulate fetching top players
      const response = await playerAPI.searchPlayers('');
      return response;
    },
  });

  const servers = ['All', 'NA', 'EU', 'Asia', 'Latam'];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load rankings" />;

  let players = data?.data?.data || [];

  // Filter by server
  if (server !== 'All') {
    players = players.filter(player => player.server === server);
  }

  // Sort by win rate
  players = [...players].sort((a, b) => b.winRate - a.winRate);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
        <p className="text-gray-400">Top players ranked by performance</p>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-gray-300 font-medium">Server:</label>
          <div className="flex space-x-2">
            {servers.map(s => (
              <button
                key={s}
                onClick={() => setServer(s)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  server === s
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 overflow-hidden">
        {players.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No players found for the selected server</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 bg-opacity-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Server
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Games
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Avg KDA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {players.map((player, index) => (
                  <tr
                    key={player.playerId}
                    className="hover:bg-slate-700 hover:bg-opacity-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">#{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/player/${player.playerId}`}
                        className="text-white font-medium hover:text-purple-400 transition-colors"
                      >
                        {player.playerName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 bg-opacity-50 text-blue-300">
                        {player.server}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-900 bg-opacity-50 text-purple-300">
                        {player.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`font-semibold ${
                        player.winRate >= 55 ? 'text-green-400' :
                        player.winRate >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {player.winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                      {player.totalGames}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-yellow-400 font-semibold">
                      {player.avgKDA.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Win Rate</h3>
          {players.slice(0, 3).map((player, index) => (
            <div key={player.playerId} className="flex items-center justify-between mb-3 last:mb-0">
              <Link
                to={`/player/${player.playerId}`}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                {index + 1}. {player.playerName}
              </Link>
              <span className="text-green-400 font-semibold">{player.winRate.toFixed(1)}%</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Most Games Played</h3>
          {[...players].sort((a, b) => b.totalGames - a.totalGames).slice(0, 3).map((player, index) => (
            <div key={player.playerId} className="flex items-center justify-between mb-3 last:mb-0">
              <Link
                to={`/player/${player.playerId}`}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                {index + 1}. {player.playerName}
              </Link>
              <span className="text-purple-400 font-semibold">{player.totalGames}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Highest KDA</h3>
          {[...players].sort((a, b) => b.avgKDA - a.avgKDA).slice(0, 3).map((player, index) => (
            <div key={player.playerId} className="flex items-center justify-between mb-3 last:mb-0">
              <Link
                to={`/player/${player.playerId}`}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                {index + 1}. {player.playerName}
              </Link>
              <span className="text-yellow-400 font-semibold">{player.avgKDA.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rankings;
