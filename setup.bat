@echo off
REM AOV Stats Website - Windows Setup Script
REM This script automates the initial setup process

echo ==================================
echo AOV Stats Website - Setup Script
echo ==================================
echo.

REM Check Node.js installation
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js v18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo √ Node.js %NODE_VERSION% found
echo.

REM Check npm installation
echo Checking npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo √ npm %NPM_VERSION% found
echo.

REM Install backend dependencies
echo ==================================
echo Installing Backend Dependencies...
echo ==================================
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Backend dependency installation failed
    pause
    exit /b 1
)
echo √ Backend dependencies installed
echo.

REM Install frontend dependencies
echo ==================================
echo Installing Frontend Dependencies...
echo ==================================
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Frontend dependency installation failed
    pause
    exit /b 1
)
echo √ Frontend dependencies installed
echo.

REM Check environment files
echo ==================================
echo Checking Environment Files...
echo ==================================

cd ..

if not exist "server\.env" (
    echo ! server\.env not found, copying from .env.example
    copy server\.env.example server\.env >nul
    echo √ Created server\.env
) else (
    echo √ server\.env exists
)

if not exist "client\.env" (
    echo ! client\.env not found, creating default
    echo VITE_API_URL=http://localhost:5000/api > client\.env
    echo √ Created client\.env
) else (
    echo √ client\.env exists
)

echo.
echo ==================================
echo Setup Complete! √
echo ==================================
echo.
echo Next Steps:
echo.
echo 1. Setup MongoDB:
echo    - Option A: MongoDB Atlas (recommended)
echo      Read: MONGODB_SETUP.md
echo    - Option B: Install MongoDB locally
echo.
echo 2. Update server\.env with your MongoDB connection string
echo.
echo 3. Seed the database:
echo    cd server
echo    node src\scrapers\runHeroScraper.js
echo    node src\scrapers\runPlayerScraper.js
echo.
echo 4. Start the development servers:
echo    Terminal 1: cd server ^&^& npm run dev
echo    Terminal 2: cd client ^&^& npm run dev
echo.
echo 5. Open http://localhost:5173 in your browser
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
