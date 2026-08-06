# Environment Management / Quản lý môi trường

## Environment Separation / Tách môi trường

HealthyHub dùng cấu hình riêng cho từng môi trường:

- Development: dùng cho máy local.
- Test: dùng cho kiểm thử tự động hoặc kiểm thử tích hợp.
- Production: dùng cho hệ thống thật.

## Secret Management / Quản lý secret

- Không commit `.env` thật.
- Không hard-code secret vào source code hoặc tài liệu.
- Production secret phải lấy từ secret manager, biến môi trường bảo mật hoặc hệ thống cấu hình của nền tảng deploy.
- Khi chia sẻ lỗi, log hoặc screenshot, phải ẩn token, password, API key và dữ liệu cá nhân.

## Configuration Rule / Quy tắc cấu hình

- Mọi biến môi trường mới phải được thêm vào file example phù hợp.
- Tên biến dùng tiếng Anh, chữ hoa và dấu gạch dưới.
- Không dùng giá trị production trong development hoặc test.
- Test nên dùng provider mock hoặc placeholder khi chưa có tích hợp thật.

