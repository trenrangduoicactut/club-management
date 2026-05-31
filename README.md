# 🎓 VTCo School – Quản lý CLB Ngoại khóa

Hệ thống web quản lý đăng ký câu lạc bộ ngoại khóa cho trường THPT.

## 🚀 Deploy lên GitHub Pages

### Bước 1 – Push code lên GitHub
```bash
git init
git add .
git commit -m "init: VTCo club management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/club-management.git
git push -u origin main
```

### Bước 2 – Sửa tên repo trong `vite.config.js`
```js
base: '/TEN_REPO_CUA_M/',
```

### Bước 3 – Bật GitHub Pages
1. Vào repo → Settings → Pages
2. Source: chọn **GitHub Actions**
3. Push lên main → tự động build & deploy ✅

### URL sau khi deploy
```
https://YOUR_USERNAME.github.io/club-management/
```

## 💻 Chạy local
```bash
npm install
npm run dev
```

## 🔑 Tài khoản demo (mật khẩu đều là 123456)
- Học sinh: an.nguyen@school.edu.vn
- Giáo viên: dung.pham@school.edu.vn
- Ban Giám Hiệu: bgh@school.edu.vn
- Quản trị viên: admin@school.edu.vn
