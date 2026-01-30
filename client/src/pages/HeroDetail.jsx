import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { heroAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function HeroDetail() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['hero', id],
    queryFn: () => heroAPI.getHeroById(id),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Hero not found" />;

  const { hero, stats } = data?.data?.data || {};

  // Prepare chart data
  const rankOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Challenger'];
  const chartData = stats
    ?.filter(stat => stat.rank !== 'All')
    .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank))
    .map(stat => ({
      rank: stat.rank,
      winRate: stat.winRate,
      pickRate: stat.pickRate,
      banRate: stat.banRate,
      avgKDA: stat.avgKDA
    })) || [];

  // Radar chart data for overall stats
  const allRankStats = stats?.find(stat => stat.rank === 'All');
  const radarData = allRankStats ? [
    { stat: 'Win Rate', value: allRankStats.winRate, fullMark: 100 },
    { stat: 'Pick Rate', value: allRankStats.pickRate, fullMark: 100 },
    { stat: 'Ban Rate', value: allRankStats.banRate, fullMark: 100 },
    { stat: 'KDA', value: allRankStats.avgKDA * 10, fullMark: 100 }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{hero.name}</h1>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold text-white">
                {hero.role}
              </span>
              <span className="text-gray-400">
                Difficulty: {'★'.repeat(hero.difficulty)}{'☆'.repeat(5 - hero.difficulty)}
              </span>
            </div>
          </div>
        </div>

        {allRankStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Win Rate</p>
              <p className={`text-3xl font-bold ${
                allRankStats.winRate >= 52 ? 'text-green-400' :
                allRankStats.winRate >= 48 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {allRankStats.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Pick Rate</p>
              <p className="text-3xl font-bold text-purple-400">{allRankStats.pickRate.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Ban Rate</p>
              <p className="text-3xl font-bold text-red-400">{allRankStats.banRate.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Avg KDA</p>
              <p className="text-3xl font-bold text-yellow-400">{allRankStats.avgKDA.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Performance by Rank</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="rank" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #8b5cf6',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="winRate" stroke="#8b5cf6" name="Win Rate %" strokeWidth={2} />
              <Line type="monotone" dataKey="pickRate" stroke="#3b82f6" name="Pick Rate %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Overall Stats</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="stat" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#9CA3AF" />
              <Radar name="Stats" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Statistics by Rank</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 bg-opacity-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pick Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ban Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg KDA
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Games Played
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {stats?.map((stat) => (
                <tr key={stat.rank} className="hover:bg-slate-700 hover:bg-opacity-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{stat.rank}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`font-semibold ${
                      stat.winRate >= 52 ? 'text-green-400' :
                      stat.winRate >= 48 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {stat.winRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                    {stat.pickRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                    {stat.banRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-yellow-400 font-semibold">
                    {stat.avgKDA.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                    {stat.gamesPlayed.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HeroDetail;
