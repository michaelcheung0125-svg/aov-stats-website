# AOV Stats Website

A full-featured Arena of Valor statistics website for tracking player performance, hero win rates, match history, and rankings.

## Features

- 🔍 **Player Search** - Search and view detailed player statistics
- 📊 **Hero Statistics** - Browse hero win rates, pick rates, and performance across all ranks
- 🎮 **Match History** - View detailed match records with KDA and game duration
- 🏆 **Leaderboards** - Check top players ranked by performance
- 📈 **Data Visualization** - Interactive charts and graphs using Recharts

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- TanStack React Query for data fetching
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for HTTP requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Puppeteer for web scraping
- Cheerio for HTML parsing
- Node-cron for scheduled tasks

## Project Structure

```
aov-stats-website/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── scrapers/      # Web scraping modules
│   │   ├── jobs/          # Scheduled tasks
│   │   └── server.js      # Entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd aov-stats-website
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Backend (.env in server directory):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aov_stats
   NODE_ENV=development
   ```

   Frontend (.env in client directory):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Seed the database with sample data**
   ```bash
   cd server
   node src/scrapers/runHeroScraper.js
   node src/scrapers/runPlayerScraper.js
   ```

3. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

4. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on http://localhost:5173

5. **Open your browser**
   Navigate to http://localhost:5173

## API Endpoints

### Heroes
- `GET /api/heroes` - Get all heroes
- `GET /api/heroes/:id` - Get hero by ID
- `GET /api/heroes/stats` - Get hero statistics with filters

### Players
- `GET /api/players/search?name=` - Search players by name
- `GET /api/players/:id` - Get player by ID
- `GET /api/players/:id/matches` - Get player match history

### Matches
- `GET /api/matches` - Get recent matches
- `GET /api/matches/:id` - Get match by ID

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run scrape:heroes` - Run hero scraper
- `npm run scrape:players` - Run player scraper

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Data Sources

The application uses web scraping to gather data from:
- Arena of Valor Wiki
- SAMURAI GAMERS Database

**Note**: The current implementation includes fallback sample data for demonstration purposes.

## Features in Detail

### Player Statistics
- Win rate and total games
- Average KDA (Kills/Deaths/Assists)
- Favorite heroes with individual win rates
- Complete match history

### Hero Statistics
- Win rate, pick rate, and ban rate
- Performance across different ranks
- Average KDA statistics
- Interactive charts showing trends

### Rankings
- Server-based leaderboards
- Top players by win rate
- Most active players
- Highest KDA rankings

## Development Notes

### Database Models
- **Hero** - Hero information (name, role, difficulty)
- **HeroStats** - Hero statistics by rank
- **Player** - Player information and stats
- **Match** - Individual match records

### Scheduled Tasks
- Daily hero statistics update at 3:00 AM
- Automatic data refresh and cache management

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
cd server
# Set environment variables
# Deploy with your platform's CLI
```

### Database (MongoDB Atlas)
- Create a free cluster at mongodb.com
- Update MONGODB_URI in .env

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Arena of Valor game by Tencent Games
- Community data sources and APIs
