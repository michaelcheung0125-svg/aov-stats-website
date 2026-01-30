import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { heroAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function Heroes() {
  const [selectedRank, setSelectedRank] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('winRate');

  const { data, isLoading, error } = useQuery({
    queryKey: ['heroStats', selectedRank, sortBy],
    queryFn: () => heroAPI.getHeroStats({ rank: selectedRank, sortBy, order: 'desc' }),
  });

  const ranks = ['All', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Challenger'];
  const roles = ['All', 'Warrior', 'Tank', 'Assassin', 'Mage', 'Marksman', 'Support'];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load hero statistics" />;

  let heroStats = data?.data?.data || [];

  // Filter by role
  if (selectedRole !== 'All') {
    heroStats = heroStats.filter(stat => stat.hero?.role === selectedRole);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Hero Statistics</h1>
        <p className="text-gray-400">Explore hero performance across all ranks</p>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Rank</label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ranks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="winRate">Win Rate</option>
              <option value="pickRate">Pick Rate</option>
              <option value="banRate">Ban Rate</option>
              <option value="avgKDA">Average KDA</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-purple-500 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 bg-opacity-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hero
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
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
                  Games
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {heroStats.map((stat, index) => (
                <tr
                  key={`${stat.heroId}-${stat.rank}`}
                  className="hover:bg-slate-700 hover:bg-opacity-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-400 font-medium">#{index + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/heroes/${stat.heroId}`}
                      className="text-white font-medium hover:text-purple-400 transition-colors capitalize"
                    >
                      {stat.hero?.name || stat.heroId.replace(/-/g, ' ')}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-900 bg-opacity-50 text-purple-300">
                      {stat.hero?.role || 'Unknown'}
                    </span>
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

        {heroStats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No heroes found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Heroes;
