@echo off
echo 🚀 Starting NFT Event Backend Deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    (
        echo MONGO_URI=mongodb://localhost:27017/nft_project_db
        echo JWT_SECRET=your_super_secret_jwt_key_%time%
        echo NODE_ENV=production
        echo ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
    ) > .env
    echo ✅ .env file created. Please update with your actual values.
)

REM Create uploads directory if it doesn't exist
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
)

REM Check if MongoDB is running
netstat -ano | findstr :27017 >nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not running. Please start MongoDB first:
    echo    net start MongoDB
)

REM Build the application (if needed)
echo 🔨 Building application...
npm run build

REM Start the application
echo 🚀 Starting the application...
echo 📖 API Documentation: http://localhost:5000/api-docs
echo 🔍 Health Check: http://localhost:5000/health
echo 🛑 Press Ctrl+C to stop the server

npm start
pause 