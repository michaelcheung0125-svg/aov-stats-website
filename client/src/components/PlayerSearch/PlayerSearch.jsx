import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerAPI } from '../../services/api';

function PlayerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    setSearchTerm(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await playerAPI.searchPlayers(value);
      setSuggestions(response.data.data || []);
    } catch (error) {
      console.error('Error searching players:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlayer = (playerId) => {
    navigate(`/player/${playerId}`);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search player by name..."
          className="w-full px-6 py-4 bg-slate-800 bg-opacity-50 border border-purple-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-purple-500 rounded-lg shadow-xl max-h-96 overflow-y-auto z-10">
          {suggestions.map((player) => (
            <div
              key={player.playerId}
              onClick={() => handleSelectPlayer(player.playerId)}
              className="px-6 py-3 hover:bg-slate-700 cursor-pointer transition-colors duration-150 border-b border-slate-700 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{player.playerName}</p>
                  <p className="text-gray-400 text-sm">
                    {player.server} • {player.rank}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-semibold">
                    {player.winRate.toFixed(1)}%
                  </p>
                  <p className="text-gray-400 text-sm">Win Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerSearch;
