# 🚀 Push NFT Event Backend lên GitHub

## 📋 Bước 1: Tạo Repository trên GitHub

### 1. Đăng nhập GitHub
- Truy cập: https://github.com
- Đăng nhập vào tài khoản của bạn

### 2. Tạo Repository mới
- Click nút **"New"** hoặc **"+"** → **"New repository"**
- Điền thông tin:
  - **Repository name**: `nft-event-backend`
  - **Description**: `Backend API cho hệ thống tạo sự kiện và mint NFT trên Solana Devnet`
  - **Visibility**: Public hoặc Private (tùy bạn)
  - **Initialize**: ❌ KHÔNG check "Add a README file" (vì đã có sẵn)
  - **Add .gitignore**: ❌ KHÔNG (đã có sẵn)
  - **Choose a license**: MIT License

### 3. Click "Create repository"

## 🔗 Bước 2: Kết nối Local Repository với GitHub

### Cách 1: Sử dụng HTTPS (Đơn giản)
```bash
# Thêm remote origin
git remote add origin https://github.com/YOUR_USERNAME/nft-event-backend.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

### Cách 2: Sử dụng SSH (Bảo mật hơn)
```bash
# Thêm remote origin với SSH
git remote add origin git@github.com:YOUR_USERNAME/nft-event-backend.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

## 🔑 Bước 3: Cấu hình Authentication

### Nếu dùng HTTPS:
- GitHub sẽ yêu cầu username và password
- Password = Personal Access Token (không phải password GitHub)
- Tạo Personal Access Token:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token → Generate new token (classic)
  3. Note: "NFT Backend Access"
  4. Expiration: 90 days
  5. Scopes: ✅ repo (tất cả)
  6. Generate token → Copy token

### Nếu dùng SSH:
- Cần setup SSH key trước
- Hướng dẫn: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## 📤 Bước 4: Push Code

```bash
# Kiểm tra remote đã được thêm chưa
git remote -v

# Push code lên GitHub
git push -u origin main

# Lần sau chỉ cần
git push
```

## 🎯 Bước 5: Kiểm tra Repository

Sau khi push thành công:
1. Truy cập: `https://github.com/YOUR_USERNAME/nft-event-backend`
2. Kiểm tra tất cả files đã được upload
3. Đọc README.md để hiểu về project

## 🔄 Bước 6: Cập nhật code trong tương lai

```bash
# Thêm changes
git add .

# Commit changes
git commit -m "Update: mô tả thay đổi"

# Push lên GitHub
git push
```

## 📝 Repository Structure

Sau khi push, repository sẽ có cấu trúc:
```
nft-event-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
├── uploads/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
├── deployment-guide.md
├── .gitignore
└── env.example
```

## 🚀 Bước 7: Deploy từ GitHub

### Heroku:
```bash
# Connect GitHub repository
heroku git:remote -a your-app-name
git push heroku main
```

### Vercel/Netlify:
- Connect GitHub repository
- Auto-deploy khi push code

### AWS/DigitalOcean:
- Clone từ GitHub repository
- Follow deployment-guide.md

## 🔧 Troubleshooting

### Lỗi Authentication:
```bash
# Reset credentials
git config --global --unset user.name
git config --global --unset user.email

# Setup lại
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Lỗi Push:
```bash
# Force push (cẩn thận!)
git push -f origin main

# Hoặc pull trước
git pull origin main
git push origin main
```

### Lỗi Remote:
```bash
# Xóa remote cũ
git remote remove origin

# Thêm lại
git remote add origin https://github.com/YOUR_USERNAME/nft-event-backend.git
```

## 🎉 Hoàn thành!

Sau khi push thành công:
- ✅ Code đã được backup trên GitHub
- ✅ Có thể collaborate với team
- ✅ Có thể deploy từ GitHub
- ✅ Có version control
- ✅ Có issue tracking và project management

**Chúc mừng! Repository NFT Event Backend đã sẵn sàng trên GitHub! 🚀** 