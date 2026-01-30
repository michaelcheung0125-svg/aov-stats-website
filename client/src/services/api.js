import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Heroes API
export const heroAPI = {
  getAllHeroes: () => api.get('/heroes'),
  getHeroById: (id) => api.get(`/heroes/${id}`),
  getHeroStats: (params) => api.get('/heroes/stats', { params }),
};

// Players API
export const playerAPI = {
  searchPlayers: (name) => api.get('/players/search', { params: { name } }),
  getPlayerById: (id) => api.get(`/players/${id}`),
  getPlayerMatches: (id, params) => api.get(`/players/${id}/matches`, { params }),
};

// Matches API
export const matchAPI = {
  getRecentMatches: (params) => api.get('/matches', { params }),
  getMatchById: (id) => api.get(`/matches/${id}`),
};

export default api;
