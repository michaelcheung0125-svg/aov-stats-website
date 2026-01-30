# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v18+)
- ✅ MongoDB installed (local) OR MongoDB Atlas account (cloud)

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" and get your connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aov_stats
   ```

### Option 2: Local MongoDB Installation

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB will run as a Windows service automatically
4. Connection string: `mongodb://localhost:27017/aov_stats`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Installation Steps

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aov_stats
NODE_ENV=development
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database with Sample Data

```bash
cd server
node src/scrapers/runHeroScraper.js
node src/scrapers/runPlayerScraper.js
```

This will populate your database with:
- 20 sample heroes with statistics
- 10 sample players with match history

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

### 5. Open Your Browser

Navigate to: http://localhost:5173

## Testing the Application

1. **Home Page**: Search for players like "ProGamer123" or "DragonSlayer"
2. **Heroes Page**: View hero statistics and filter by rank/role
3. **Rankings Page**: See the leaderboard of top players
4. **Click on any hero or player** to view detailed statistics

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
- Ensure MongoDB is running
- Check your connection string in `.env`
- For local MongoDB: `mongodb://localhost:27017/aov_stats`
- For Atlas: Use the connection string from MongoDB Atlas

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
- Change PORT in `server/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `client/.env` accordingly

### Frontend Can't Connect to Backend

**Error**: Network errors or API calls failing

**Solution**:
- Ensure backend is running on http://localhost:5000
- Check CORS settings in `server/src/server.js`
- Verify `VITE_API_URL` in `client/.env`

### No Data Showing

**Solution**:
- Run the scraper scripts to populate the database:
  ```bash
  cd server
  node src/scrapers/runHeroScraper.js
  node src/scrapers/runPlayerScraper.js
  ```

## API Testing

Test the backend API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all heroes
curl http://localhost:5000/api/heroes

# Get hero stats
curl http://localhost:5000/api/heroes/stats?rank=All

# Search players
curl http://localhost:5000/api/players/search?name=Pro
```

## Development Tips

### Hot Reload
- Frontend: Vite provides instant hot reload
- Backend: Nodemon automatically restarts on file changes

### Database Management

View your data using MongoDB Compass:
1. Download from https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Browse the `aov_stats` database

### Adding More Sample Data

Edit the scraper files:
- `server/src/scrapers/heroScraper.js` - Add more heroes
- `server/src/scrapers/playerScraper.js` - Add more players

## Next Steps

1. **Customize the UI**: Edit components in `client/src/components/`
2. **Add Real Data Sources**: Implement actual web scraping in scrapers
3. **Deploy**: Follow deployment instructions in README.md
4. **Add Features**:
   - User authentication
   - Real-time updates
   - Advanced filtering
   - Export statistics

## Project Structure Overview

```
aov-stats-website/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   └── App.jsx           # Main app
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database schemas
│   │   ├── routes/           # API endpoints
│   │   ├── scrapers/         # Data collection
│   │   └── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check that ports 5000 and 5173 are available

Happy coding! 🚀
