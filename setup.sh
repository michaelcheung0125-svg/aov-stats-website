#!/bin/bash

# AOV Stats Website - Setup Script
# This script automates the initial setup process

echo "=================================="
echo "AOV Stats Website - Setup Script"
echo "=================================="
echo ""

# Check Node.js installation
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Check npm installation
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"
echo ""

# Install backend dependencies
echo "=================================="
echo "Installing Backend Dependencies..."
echo "=================================="
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "=================================="
echo "Installing Frontend Dependencies..."
echo "=================================="
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Check environment files
echo "=================================="
echo "Checking Environment Files..."
echo "=================================="

cd ..

if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env not found, copying from .env.example"
    cp server/.env.example server/.env
    echo "✅ Created server/.env"
else
    echo "✅ server/.env exists"
fi

if [ ! -f "client/.env" ]; then
    echo "⚠️  client/.env not found, creating default"
    echo "VITE_API_URL=http://localhost:5000/api" > client/.env
    echo "✅ Created client/.env"
else
    echo "✅ client/.env exists"
fi

echo ""
echo "=================================="
echo "Setup Complete! ✅"
echo "=================================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Setup MongoDB:"
echo "   - Option A: MongoDB Atlas (recommended)"
echo "     Read: MONGODB_SETUP.md"
echo "   - Option B: Install MongoDB locally"
echo ""
echo "2. Update server/.env with your MongoDB connection string"
echo ""
echo "3. Seed the database:"
echo "   cd server"
echo "   node src/scrapers/runHeroScraper.js"
echo "   node src/scrapers/runPlayerScraper.js"
echo ""
echo "4. Start the development servers:"
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm run dev"
echo ""
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
