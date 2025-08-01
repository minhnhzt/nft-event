#!/bin/bash

echo "🚀 Starting NFT Event Backend Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/nft_project_db
JWT_SECRET=your_super_secret_jwt_key_$(date +%s)
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
EOF
    echo "✅ .env file created. Please update with your actual values."
fi

# Create uploads directory if it doesn't exist
if [ ! -d uploads ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   or"
    echo "   brew services start mongodb-community"
fi

# Build the application (if needed)
echo "🔨 Building application..."
npm run build

# Start the application
echo "🚀 Starting the application..."
echo "📖 API Documentation: http://localhost:5000/api-docs"
echo "🔍 Health Check: http://localhost:5000/health"
echo "🛑 Press Ctrl+C to stop the server"

npm start 