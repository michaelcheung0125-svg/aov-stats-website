import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playerAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function PlayerProfile() {
  const { id } = useParams();

  const { data: playerData, isLoading: playerLoading, error: playerError } = useQuery({
    queryKey: ['player', id],
    queryFn: () => playerAPI.getPlayerById(id),
  });

  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['playerMatches', id],
    queryFn: () => playerAPI.getPlayerMatches(id, { limit: 20 }),
  });

  if (playerLoading) return <LoadingSpinner />;
  if (playerError) return <ErrorMessage message="Player not found" />;

  const player = playerData?.data?.data;
  const matches = matchesData?.data?.data || [];

  const calculateKDA = (kda) => {
    if (!kda) return 0;
    return ((kda.kills + kda.assists) / Math.max(kda.deaths, 1)).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{player.playerName}</h1>
            <div className="flex items-center space-x-4 text-gray-300">
              <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold">
                {player.rank}
              </span>
              <span>{player.server}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Last Updated</p>
            <p className="text-white">{new Date(player.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Win Rate</p>
            <p className="text-3xl font-bold text-purple-400">{player.winRate.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Total Games</p>
            <p className="text-3xl font-bold text-white">{player.totalGames}</p>
          </div>
          <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Wins / Losses</p>
            <p className="text-3xl font-bold text-green-400">
              {player.wins} <span className="text-xl text-gray-400">/</span>{' '}
              <span className="text-red-400">{player.losses}</span>
            </p>
          </div>
          <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Avg KDA</p>
            <p className="text-3xl font-bold text-yellow-400">{player.avgKDA.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Favorite Heroes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {player.favoriteHeroes.map((hero, index) => (
            <div
              key={index}
              className="bg-slate-900 bg-opacity-50 p-4 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-semibold capitalize">
                  {hero.heroId.replace(/-/g, ' ')}
                </h3>
                <span className="text-purple-400 font-semibold">{hero.winRate.toFixed(1)}%</span>
              </div>
              <p className="text-gray-400 text-sm">{hero.gamesPlayed} games played</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Match History</h2>
        {matchesLoading ? (
          <LoadingSpinner />
        ) : matches.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No match history available</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.matchId}
                className={`p-4 rounded-lg border ${
                  match.result === 'win'
                    ? 'bg-green-900 bg-opacity-20 border-green-500'
                    : 'bg-red-900 bg-opacity-20 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded font-semibold text-sm ${
                        match.result === 'win'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {match.result.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">
                        {match.heroId.replace(/-/g, ' ')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-white font-semibold">
                        {match.kda.kills} / {match.kda.deaths} / {match.kda.assists}
                      </p>
                      <p className="text-gray-400 text-sm">KDA</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-400 font-semibold">{calculateKDA(match.kda)}</p>
                      <p className="text-gray-400 text-sm">Ratio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">
                        {Math.floor(match.duration / 60)}:{(match.duration % 60).toString().padStart(2, '0')}
                      </p>
                      <p className="text-gray-400 text-sm">Duration</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerProfile;
