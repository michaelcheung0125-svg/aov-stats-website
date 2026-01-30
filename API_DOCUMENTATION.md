# API Documentation

## Base URL

**Development**: `http://localhost:5000/api`
**Production**: `https://your-backend.onrender.com/api`

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-31T12:00:00.000Z"
}
```

---

## Heroes

### GET /heroes

Get all heroes.

**Query Parameters**: None

**Response**:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "heroId": "valhein",
      "name": "Valhein",
      "nameEn": "Valhein",
      "role": "Marksman",
      "difficulty": 1,
      "imageUrl": "",
      "skills": [],
      "createdAt": "2026-01-31T12:00:00.000Z",
      "updatedAt": "2026-01-31T12:00:00.000Z"
    }
  ]
}
```

---

### GET /heroes/:id

Get a single hero by ID with statistics.

**URL Parameters**:
- `id` (string, required) - Hero ID (e.g., "valhein")

**Response**:
```json
{
  "success": true,
  "data": {
    "hero": {
      "heroId": "valhein",
      "name": "Valhein",
      "nameEn": "Valhein",
      "role": "Marksman",
      "difficulty": 1,
      "imageUrl": "",
      "skills": []
    },
    "stats": [
      {
        "heroId": "valhein",
        "rank": "All",
        "winRate": 52.5,
        "pickRate": 15.3,
        "banRate": 5.2,
        "avgKDA": 3.45,
        "gamesPlayed": 5000,
        "lastUpdated": "2026-01-31T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses**:
- `404 Not Found` - Hero not found

---

### GET /heroes/stats

Get hero statistics with filtering and sorting.

**Query Parameters**:
- `rank` (string, optional) - Filter by rank (default: "All")
  - Options: "All", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Challenger"
- `sortBy` (string, optional) - Sort field (default: "winRate")
  - Options: "winRate", "pickRate", "banRate", "avgKDA", "gamesPlayed"
- `order` (string, optional) - Sort order (default: "desc")
  - Options: "asc", "desc"

**Example Request**:
```
GET /heroes/stats?rank=Diamond&sortBy=winRate&order=desc
```

**Response**:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "heroId": "murad",
      "rank": "Diamond",
      "winRate": 55.8,
      "pickRate": 12.5,
      "banRate": 25.3,
      "avgKDA": 4.2,
      "gamesPlayed": 3500,
      "lastUpdated": "2026-01-31T12:00:00.000Z",
      "hero": {
        "heroId": "murad",
        "name": "Murad",
        "role": "Assassin",
        "difficulty": 5
      }
    }
  ]
}
```

---

## Players

### GET /players/search

Search for players by name.

**Query Parameters**:
- `name` (string, required) - Player name to search (minimum 2 characters)

**Example Request**:
```
GET /players/search?name=Pro
```

**Response**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "playerId": "player-progamer123",
      "playerName": "ProGamer123",
      "server": "NA",
      "rank": "Diamond",
      "winRate": 58.5,
      "totalGames": 350,
      "wins": 205,
      "losses": 145,
      "avgKDA": 3.8,
      "favoriteHeroes": [
        {
          "heroId": "murad",
          "gamesPlayed": 85,
          "winRate": 62.3
        }
      ],
      "lastUpdated": "2026-01-31T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request` - Name parameter missing or too short

---

### GET /players/:id

Get player details by ID.

**URL Parameters**:
- `id` (string, required) - Player ID

**Response**:
```json
{
  "success": true,
  "data": {
    "playerId": "player-progamer123",
    "playerName": "ProGamer123",
    "server": "NA",
    "rank": "Diamond",
    "winRate": 58.5,
    "totalGames": 350,
    "wins": 205,
    "losses": 145,
    "avgKDA": 3.8,
    "favoriteHeroes": [
      {
        "heroId": "murad",
        "gamesPlayed": 85,
        "winRate": 62.3
      }
    ],
    "lastUpdated": "2026-01-31T12:00:00.000Z"
  }
}
```

**Error Responses**:
- `404 Not Found` - Player not found

---

### GET /players/:id/matches

Get player's match history.

**URL Parameters**:
- `id` (string, required) - Player ID

**Query Parameters**:
- `limit` (number, optional) - Number of matches to return (default: 20, max: 100)
- `offset` (number, optional) - Number of matches to skip (default: 0)

**Example Request**:
```
GET /players/player-progamer123/matches?limit=10&offset=0
```

**Response**:
```json
{
  "success": true,
  "count": 10,
  "total": 200,
  "data": [
    {
      "matchId": "match-player-progamer123-1738329600000-0",
      "playerId": "player-progamer123",
      "heroId": "murad",
      "result": "win",
      "kda": {
        "kills": 12,
        "deaths": 3,
        "assists": 8
      },
      "duration": 1245,
      "matchDate": "2026-01-31T12:00:00.000Z",
      "teammates": [],
      "opponents": []
    }
  ]
}
```

---

## Matches

### GET /matches

Get recent matches.

**Query Parameters**:
- `limit` (number, optional) - Number of matches to return (default: 50, max: 100)

**Example Request**:
```
GET /matches?limit=20
```

**Response**:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "matchId": "match-player-progamer123-1738329600000-0",
      "playerId": "player-progamer123",
      "heroId": "murad",
      "result": "win",
      "kda": {
        "kills": 12,
        "deaths": 3,
        "assists": 8
      },
      "duration": 1245,
      "matchDate": "2026-01-31T12:00:00.000Z",
      "teammates": [],
      "opponents": []
    }
  ]
}
```

---

### GET /matches/:id

Get match details by ID.

**URL Parameters**:
- `id` (string, required) - Match ID

**Response**:
```json
{
  "success": true,
  "data": {
    "matchId": "match-player-progamer123-1738329600000-0",
    "playerId": "player-progamer123",
    "heroId": "murad",
    "result": "win",
    "kda": {
      "kills": 12,
      "deaths": 3,
      "assists": 8
    },
    "duration": 1245,
    "matchDate": "2026-01-31T12:00:00.000Z",
    "teammates": [],
    "opponents": []
  }
}
```

**Error Responses**:
- `404 Not Found` - Match not found

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there is no rate limiting implemented. This should be added for production use.

**Recommended**: 100 requests per 15 minutes per IP address.

---

## CORS

CORS is enabled for all origins in development. For production, configure allowed origins in `server/src/server.js`.

---

## Data Models

### Hero
```javascript
{
  heroId: String,        // Unique identifier
  name: String,          // Hero name
  nameEn: String,        // English name
  role: String,          // Warrior, Tank, Assassin, Mage, Marksman, Support
  difficulty: Number,    // 1-5
  imageUrl: String,      // Hero image URL
  skills: Array,         // Hero skills
  createdAt: Date,
  updatedAt: Date
}
```

### HeroStats
```javascript
{
  heroId: String,        // Reference to Hero
  rank: String,          // Bronze, Silver, Gold, etc.
  winRate: Number,       // 0-100
  pickRate: Number,      // 0-100
  banRate: Number,       // 0-100
  avgKDA: Number,        // Average KDA
  gamesPlayed: Number,   // Total games
  lastUpdated: Date
}
```

### Player
```javascript
{
  playerId: String,      // Unique identifier
  playerName: String,    // Player name
  server: String,        // NA, EU, Asia, Latam
  rank: String,          // Bronze, Silver, Gold, etc.
  winRate: Number,       // 0-100
  totalGames: Number,    // Total games played
  wins: Number,          // Total wins
  losses: Number,        // Total losses
  avgKDA: Number,        // Average KDA
  favoriteHeroes: Array, // Top heroes
  lastUpdated: Date
}
```

### Match
```javascript
{
  matchId: String,       // Unique identifier
  playerId: String,      // Reference to Player
  heroId: String,        // Reference to Hero
  result: String,        // "win" or "loss"
  kda: {
    kills: Number,
    deaths: Number,
    assists: Number
  },
  duration: Number,      // Match duration in seconds
  matchDate: Date,       // When match was played
  teammates: Array,      // Teammate IDs
  opponents: Array       // Opponent IDs
}
```

---

## Testing with cURL

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Heroes
```bash
curl http://localhost:5000/api/heroes
```

### Get Hero Stats
```bash
curl "http://localhost:5000/api/heroes/stats?rank=All&sortBy=winRate"
```

### Search Players
```bash
curl "http://localhost:5000/api/players/search?name=Pro"
```

### Get Player
```bash
curl http://localhost:5000/api/players/player-progamer123
```

### Get Player Matches
```bash
curl "http://localhost:5000/api/players/player-progamer123/matches?limit=10"
```

---

## Testing with Postman

1. Import the following collection:

```json
{
  "info": {
    "name": "AOV Stats API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get All Heroes",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/heroes"
      }
    },
    {
      "name": "Get Hero Stats",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/heroes/stats?rank=All&sortBy=winRate",
          "query": [
            {"key": "rank", "value": "All"},
            {"key": "sortBy", "value": "winRate"}
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

2. Set environment variable:
   - `baseUrl`: `http://localhost:5000/api`

---

## Future Enhancements

### Planned Features
- [ ] Authentication (JWT)
- [ ] Rate limiting
- [ ] Pagination for all list endpoints
- [ ] Filtering by multiple criteria
- [ ] Sorting by multiple fields
- [ ] WebSocket for real-time updates
- [ ] GraphQL API option
- [ ] API versioning (v1, v2)

### Recommended Improvements
- Add request validation with express-validator
- Implement caching with Redis
- Add API documentation with Swagger
- Implement request logging
- Add performance monitoring
- Create API client SDK

---

**Last Updated**: 2026-01-31
**Version**: 1.0.0
