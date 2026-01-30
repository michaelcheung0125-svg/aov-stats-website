# MongoDB Setup Guide for Windows

## Quick Setup - MongoDB Atlas (Recommended)

The easiest way to get started is using MongoDB Atlas (free cloud database):

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new project (e.g., "AOV Stats")

### Step 2: Create a Free Cluster

1. Click "Build a Database"
2. Choose "M0 Free" tier
3. Select a cloud provider and region (closest to you)
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Configure Database Access

1. Click "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `aovuser`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access

1. Click "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String

1. Go back to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://aovuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update Your .env File

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://aovuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aov_stats?retryWrites=true&w=majority
NODE_ENV=development
```

**Important**: Replace `YOUR_PASSWORD` with your actual password!

---

## Alternative: Local MongoDB Installation (Windows)

If you prefer running MongoDB locally:

### Step 1: Download MongoDB

1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0+)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Click "Next" and "Install"
6. Wait for installation to complete

### Step 3: Verify Installation

Open Command Prompt and run:
```bash
mongod --version
```

You should see version information.

### Step 4: Start MongoDB Service

MongoDB should start automatically as a Windows service. To verify:

1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for "MongoDB Server" in the list
4. Status should be "Running"

If not running:
- Right-click "MongoDB Server"
- Click "Start"

### Step 5: Update Your .env File

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aov_stats
NODE_ENV=development
```

### Step 6: Test Connection

Open MongoDB Compass (installed with MongoDB):
1. Connection string: `mongodb://localhost:27017`
2. Click "Connect"
3. You should see the connection successful

---

## Verify Setup

After setting up MongoDB (Atlas or Local), test the connection:

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net (or localhost)
```

### 2. Seed the Database

```bash
# In a new terminal
cd server
node src/scrapers/runHeroScraper.js
```

You should see:
```
MongoDB Connected: ...
Starting hero data scraping...
Found 20 heroes
Successfully saved 20 heroes to database
Hero scraping completed successfully!
```

Then seed players:
```bash
node src/scrapers/runPlayerScraper.js
```

### 3. Test API Endpoints

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get heroes
curl http://localhost:5000/api/heroes

# Get hero stats
curl http://localhost:5000/api/heroes/stats
```

---

## Troubleshooting

### Error: "connect ECONNREFUSED"

**Problem**: Can't connect to MongoDB

**Solutions**:
- **Atlas**: Check your connection string, password, and network access settings
- **Local**: Ensure MongoDB service is running (check services.msc)
- Verify `MONGODB_URI` in `.env` is correct

### Error: "Authentication failed"

**Problem**: Wrong username/password for Atlas

**Solutions**:
- Double-check your password in the connection string
- Make sure you replaced `<password>` with actual password
- No special characters should be URL-encoded (use %40 for @, %23 for #, etc.)

### Error: "IP not whitelisted"

**Problem**: Your IP is not allowed to connect to Atlas

**Solutions**:
- Go to Network Access in Atlas
- Add your current IP or use "Allow Access from Anywhere"

### MongoDB Compass Won't Connect

**Solutions**:
- For local: Use `mongodb://localhost:27017`
- For Atlas: Use the connection string from Atlas (without `/aov_stats` database name)

---

## Next Steps

Once MongoDB is connected:

1. ✅ Start backend: `cd server && npm run dev`
2. ✅ Seed database: `node src/scrapers/runHeroScraper.js`
3. ✅ Seed players: `node src/scrapers/runPlayerScraper.js`
4. ✅ Start frontend: `cd client && npm run dev`
5. ✅ Open browser: http://localhost:5173

---

## MongoDB Compass - Visual Database Tool

MongoDB Compass is a GUI tool to view and manage your data:

### Connect to Your Database

**Local MongoDB**:
```
mongodb://localhost:27017
```

**MongoDB Atlas**:
```
mongodb+srv://aovuser:password@cluster0.xxxxx.mongodb.net/
```

### View Your Data

1. Connect to your database
2. Click on `aov_stats` database
3. You'll see collections:
   - `heroes` - Hero information
   - `herostats` - Hero statistics
   - `players` - Player data
   - `matches` - Match history

### Useful Operations

- **Browse documents**: Click on a collection to view data
- **Filter**: Use the filter bar to search (e.g., `{role: "Mage"}`)
- **Delete all**: Select collection → Delete → Delete all documents
- **Export**: Collection → Export Collection

---

## Production Deployment

For production, always use MongoDB Atlas:

1. Create a production cluster
2. Use strong passwords
3. Restrict IP access to your server's IP only
4. Enable backup
5. Monitor usage in Atlas dashboard

---

## Support

If you still have issues:
1. Check MongoDB logs: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`
2. Restart MongoDB service
3. Try MongoDB Atlas instead of local installation
4. Check firewall settings

Happy coding! 🚀
