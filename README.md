# 🚀 NFT Event Backend

Backend API cho hệ thống tạo sự kiện và mint NFT trên Solana Devnet.

## ✨ Tính năng

- 🔐 **Authentication**: JWT với role-based access control
- 🎨 **NFT Templates**: Tạo và quản lý mẫu NFT
- 📅 **Event Management**: Tạo sự kiện, quản lý participants
- ⚡ **Solana Integration**: Mint NFT thực tế trên Solana Devnet
- 👨‍💼 **Admin Dashboard**: Quản lý users, events, templates
- 📚 **API Documentation**: Swagger/OpenAPI docs
- 🔒 **Security**: Rate limiting, helmet, CORS, validation

## 🛠️ Cài đặt

### Yêu cầu
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

### Bước 1: Clone repository
```bash
git clone https://github.com/minhnhzt/nft-event.git
cd nft-event
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình environment
```bash
# Copy file env.example
cp env.example .env

# Chỉnh sửa .env với thông tin của bạn
MONGO_URI=mongodb://localhost:27017/nft_project_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Bước 4: Khởi động MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Bước 5: Chạy ứng dụng
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Thông tin user
- `PUT /api/auth/profile` - Cập nhật profile

### NFT Templates
- `POST /api/nft-templates` - Tạo template
- `GET /api/nft-templates` - Danh sách templates
- `GET /api/nft-templates/:id` - Chi tiết template
- `PUT /api/nft-templates/:id` - Cập nhật template
- `DELETE /api/nft-templates/:id` - Xóa template

### Events
- `POST /api/events` - Tạo sự kiện
- `GET /api/events` - Danh sách sự kiện
- `GET /api/events/:id` - Chi tiết sự kiện
- `PUT /api/events/:id` - Cập nhật sự kiện
- `DELETE /api/events/:id` - Xóa sự kiện
- `POST /api/events/:id/participants` - Thêm participant

### Mint
- `POST /api/mint` - Mint NFT cho participant
- `POST /api/mint/bulk` - Mint NFT cho nhiều participants
- `GET /api/mint` - Lịch sử mint
- `GET /api/mint/stats` - Thống kê mint

### Admin (Admin role required)
- `GET /api/admin/dashboard` - Dashboard thống kê
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/events` - Quản lý events
- `GET /api/admin/templates` - Quản lý templates

## 🔐 Authentication

API sử dụng JWT Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## 📖 API Documentation

Truy cập Swagger docs: `http://localhost:5000/api-docs`

## 🐳 Docker Deployment

```bash
# Build và chạy với Docker Compose
docker-compose up -d

# Xem logs
docker-compose logs -f
```

## 🚀 Production Deployment

Xem chi tiết trong [deployment-guide.md](deployment-guide.md)

## 🏗️ Cấu trúc dự án

```
nft-event-backend/
├── src/
│   ├── config/          # Swagger config
│   ├── controllers/     # API controllers
│   ├── middlewares/     # Auth, upload, rate limiting
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Solana utilities
│   └── app.js           # Express app
├── uploads/             # File uploads
├── Dockerfile           # Docker config
├── docker-compose.yml   # Multi-service setup
├── package.json         # Dependencies
└── README.md           # Documentation
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection | - |
| `JWT_SECRET` | JWT secret key | - |
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `ALLOWED_ORIGINS` | CORS origins | * |

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Support

- 📧 Email: support@nftevent.com
- 📖 Documentation: `/api-docs`
- 🐛 Issues: [GitHub Issues](https://github.com/minhnhzt/nft-event/issues)

---

**Made with ❤️ for the NFT community** 