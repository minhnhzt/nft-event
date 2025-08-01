# 🚀 NFT Event Backend - Deployment Guide

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 4.4
- Git

## 🛠️ Local Development Deployment

### 1. Clone and Setup
```bash
git clone <repository-url>
cd nft-event-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Create .env file
cp .env.example .env

# Edit .env with your values
MONGO_URI=mongodb://localhost:27017/nft_project_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. Run Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 6. Test Application
```bash
# Test basic functionality
python test_simple.py

# Test authentication (requires MongoDB)
python test_auth.py

# Test Solana integration
python test_solana_mint.py
```

## 🐳 Docker Deployment

### 1. Using Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Manual Docker Build
```bash
# Build image
docker build -t nft-backend .

# Run container
docker run -d \
  --name nft-backend \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/nft_project_db \
  -e JWT_SECRET=your_secret_key \
  -v $(pwd)/uploads:/app/uploads \
  nft-backend
```

## ☁️ Cloud Deployment

### 1. Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-nft-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_super_secret_jwt_key
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://yourdomain.com

# Deploy
git push heroku main
```

### 2. AWS EC2 Deployment
```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb

# Clone repository
git clone <repository-url>
cd nft-event-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "nft-backend"
pm2 startup
pm2 save
```

### 3. DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS`
3. Deploy automatically

## 🔧 Production Configuration

### 1. Environment Variables
```env
NODE_ENV=production
MONGO_URI=mongodb://username:password@host:port/database
JWT_SECRET=your_very_strong_secret_key_here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
PORT=5000
```

### 2. Security Checklist
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

### 3. Performance Optimization
- [ ] Enable compression
- [ ] Use CDN for static files
- [ ] Database indexing
- [ ] Caching (Redis)
- [ ] Load balancing

## 📊 Monitoring and Logging

### 1. Health Check
```bash
curl http://your-domain.com/health
```

### 2. API Documentation
```
http://your-domain.com/api-docs
```

### 3. Logs
```bash
# Docker
docker-compose logs -f backend

# PM2
pm2 logs nft-backend

# System
sudo journalctl -u nft-backend -f
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to server
      run: |
        # Your deployment commands
```

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Permission Denied**
   ```bash
   # Fix uploads directory permissions
   sudo chown -R $USER:$USER uploads/
   chmod 755 uploads/
   ```

4. **JWT Token Issues**
   - Check JWT_SECRET is set
   - Verify token expiration
   - Check token format

### Support
- Check logs for detailed error messages
- Verify environment variables
- Test endpoints individually
- Use API documentation for reference

## 📈 Scaling

### Horizontal Scaling
- Use load balancer
- Multiple application instances
- Database clustering
- Redis for session storage

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use caching strategies
- CDN for static assets 