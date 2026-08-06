# Security / Bảo mật

## Authentication / Xác thực

Hệ thống cần chuẩn bị cơ chế đăng ký, đăng nhập, đăng xuất, refresh token và quản lý phiên khi triển khai thực tế.

## Authorization / Phân quyền

Phân quyền theo role và permission. Mọi API nhạy cảm phải khai báo permission trong tài liệu API.

## JWT / Token

- JWT secret phải lấy từ environment.
- Token hết hạn theo cấu hình.
- Không lưu token trong log.
- Refresh token cần có chiến lược thu hồi.

## Protection / Phòng chống tấn công

- Validation bắt buộc ở backend.
- Dùng query parameter binding hoặc ORM/query builder an toàn để chống SQL Injection.
- Escape hoặc sanitize dữ liệu hiển thị để chống XSS.
- Có CSRF strategy cho flow dùng cookie.
- Có rate limit cho auth, payment, AI và public API.

## Privacy / Quyền riêng tư

Không thu thập dữ liệu cá nhân ngoài mục đích sản phẩm. Dữ liệu nhạy cảm phải có chính sách lưu trữ, truy cập và xóa.

