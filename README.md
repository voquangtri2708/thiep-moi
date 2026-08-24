# Hướng Dẫn Nâng Cấp Thiệp Mời Sinh Nhật Online Tĩnh (Birthday Invitation App)

Dự án là ứng dụng thiệp mời sinh nhật tĩnh (HTML/CSS/JS) với khả năng **chỉnh sửa toàn bộ thông tin** và **tạo link mời khách hàng loạt** cá nhân hóa. Chạy trực tiếp 100% trên **GitHub Pages**, **Vercel**, **Netlify** hoặc mở file trực tiếp.

---

## 🌟 Các Chức Năng Nổi Bật

### 1. Giao diện Thiệp Mời Sinh Nhật (Trang chủ / `/`)
- **Phong bì tương tác**: Mở phong bì kèm hiệu ứng bắn pháo hoa Confetti và nhạc nền.
- **Tùy biến toàn bộ thông tin**: Tên chủ nhân bữa tiệc, tiêu đề tiệc, lời mời, ngày giờ, địa điểm & link Google Maps.
- **Tích hợp VietQR**: Hiển thị QR chuyển khoản mừng sinh nhật tự động cập nhật theo ngân hàng và số tài khoản.
- **Bộ đếm ngược (Countdown)**: Tự động đếm ngược đến giờ G bữa tiệc.
- **Album kỷ niệm & Sổ lưu bút**: Khách mời có thể xem ảnh và để lại lời chúc mừng sinh nhật.

### 2. Trang Chỉnh Sửa Thiệp (`/edit` hoặc `index.html#/edit`)
- Thay đổi tên, tiêu đề, ngày giờ, địa điểm, ảnh đại diện, album ảnh, nhạc nền MP3.
- **Tự động tạo mã VietQR**: Chọn ngân hàng (MBBank, Vietcombank, Techcombank, VPBank, ACB, BIDV, Agribank, TPBank, VietinBank,...) + Nhập STK + Tên chủ tài khoản -> Hệ thống tự động tạo mã QR VietQR động.
- Hỗ trợ chọn file ảnh từ máy tính (tự chuyển thành Base64) hoặc dán URL ảnh.
- Tất cả cấu hình được lưu tự động vào `localStorage`.

### 3. Trang Tạo Link Mời Khách (`/send` hoặc `index.html#/send`)
- Nhập tên khách mời (Ví dụ: `Anh Nam & Chị Linh`).
- Tự động sinh đường link riêng: `https://<domain>/?to=Anh+Nam+%26+Chi+Linh`.
- Nút **Sao Chép Link** một chạm có thông báo Toast.
- Chia sẻ nhanh qua Zalo, Messenger, SMS và quản lý danh sách link đã lưu.

---

## 🚀 Cách Deploy Lên GitHub Pages

1. Upload toàn bộ các file (`index.html`, `edit.html`, `send.html`, `README.md`) lên GitHub Repository.
2. Vào **Settings** -> **Pages** trên GitHub.
3. Chọn Branch `main` (hoặc `master`) và thư mục `/(root)` -> Bấm **Save**.
4. GitHub sẽ cấp link website dạng: `https://<username>.github.io/<repo-name>/`.
