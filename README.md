# NFT Event Backend

Backend API cho hệ thống tạo sự kiện và mint NFT trên Solana Devnet.

## 🚀 Tính năng

- **Authentication & Authorization**: JWT với role-based access control
- **NFT Template Management**: Tạo, quản lý mẫu NFT
- **Event Management**: Tạo sự kiện, quản lý participants
- **Solana Integration**: Mint NFT thực tế trên Solana Devnet
- **Admin Dashboard**: Quản lý users, events, templates, mint records
- **API Documentation**: Swagger/OpenAPI docs
- **Security**: Rate limiting, helmet, CORS, validation
- **Performance**: Compression, pagination, optimization

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

## 🛠️ Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd nft-event-backend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình environment**
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
MONGO_URI=mongodb://localhost:27017/nft_project_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

4. **Khởi động MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Chạy server**
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật profile

### NFT Templates
- `POST /api/nft-templates` - Tạo NFT template
- `GET /api/nft-templates` - Lấy danh sách templates
- `GET /api/nft-templates/:id` - Lấy chi tiết template
- `PUT /api/nft-templates/:id` - Cập nhật template
- `DELETE /api/nft-templates/:id` - Xóa template

### Events
- `POST /api/events` - Tạo sự kiện
- `GET /api/events` - Lấy danh sách sự kiện
- `GET /api/events/:id` - Lấy chi tiết sự kiện
- `PUT /api/events/:id` - Cập nhật sự kiện
- `DELETE /api/events/:id` - Xóa sự kiện
- `POST /api/events/:id/participants` - Thêm participant
- `DELETE /api/events/:id/participants/:participantId` - Xóa participant

### Mint
- `POST /api/mint` - Mint NFT cho participant
- `POST /api/mint/bulk` - Mint NFT cho nhiều participants
- `GET /api/mint` - Lấy lịch sử mint
- `GET /api/mint/stats` - Lấy thống kê mint
- `POST /api/mint/airdrop` - Airdrop SOL (admin only)

### Admin (Admin role required)
- `GET /api/admin/dashboard` - Dashboard thống kê
- `GET /api/admin/users` - Quản lý users
- `PUT /api/admin/users/:userId/role` - Cập nhật role user
- `DELETE /api/admin/users/:userId` - Xóa user
- `GET /api/admin/events` - Quản lý events
- `GET /api/admin/templates` - Quản lý templates
- `GET /api/admin/mints` - Quản lý mint records

## 🔐 Authentication

API sử dụng JWT Bearer token. Thêm header:
```
Authorization: Bearer <your_jwt_token>
```

## 📖 API Documentation

Truy cập Swagger docs tại: `http://localhost:5000/api-docs`

## 🏗️ Cấu trúc dự án

```
backend/
├── src/
│   ├── config/
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── nftTemplateController.js
│   │   ├── eventController.js
│   │   ├── mintController.js
│   │   └── adminController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── NFTTemplate.js
│   │   ├── Event.js
│   │   └── MintRecord.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── nftTemplate.js
│   │   ├── event.js
│   │   ├── mint.js
│   │   └── admin.js
│   ├── utils/
│   │   └── solana.js
│   └── app.js
├── uploads/
├── server.js
├── package.json
└── README.md
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `ALLOWED_ORIGINS` | CORS allowed origins | * |

## 🚀 Deployment

### Production Setup

1. **Cấu hình environment**
```env
NODE_ENV=production
MONGO_URI=mongodb://your-production-mongo-uri
JWT_SECRET=your-strong-jwt-secret
ALLOWED_ORIGINS=https://yourdomain.com
```

2. **Build và deploy**
```bash
npm run deploy
```

### Docker (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Test authentication
python test_auth.py

# Test Solana integration
python test_solana_mint.py
```

## 🔒 Security Features

- **JWT Authentication** với role-based access control
- **Rate Limiting** cho tất cả endpoints
- **Input Validation** và sanitization
- **CORS Protection**
- **Helmet Security Headers**
- **Error Handling** tập trung
- **File Upload Security**

## 📊 Performance Features

- **Compression** cho responses
- **Pagination** cho tất cả list endpoints
- **Database Indexing**
- **Caching** (có thể thêm Redis)
- **Connection Pooling**

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License

## 🆘 Support

- Email: support@nftevent.com
- Documentation: `/api-docs`
- Issues: GitHub Issues

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete NFT minting system
- Solana Devnet integration
- Admin dashboard
- API documentation 