# Security Policy / Chính sách bảo mật

## Scope / Phạm vi

Tài liệu này định nghĩa nguyên tắc bảo mật cho HealthyHub và các dự án tái sử dụng framework này.

## Required Controls / Kiểm soát bắt buộc

- Authentication / Xác thực.
- Authorization / Phân quyền.
- JWT security / Bảo mật token.
- Role permission / Quyền theo vai trò.
- Input validation / Kiểm tra dữ liệu đầu vào.
- SQL injection protection / Chống SQL Injection.
- XSS protection / Chống XSS.
- CSRF protection / Chống CSRF.
- Rate limit / Giới hạn tần suất.
- Environment security / Bảo mật biến môi trường.
- API security / Bảo mật API.
- Data privacy / Quyền riêng tư dữ liệu.

## Reporting / Báo cáo

Khi phát hiện lỗ hổng, tạo báo cáo trong `security/reports` hoặc issue riêng tư trên GitHub. Không công khai thông tin khai thác trước khi có phương án xử lý.

## AI Agent Rule / Quy tắc cho AI Agent

AI Agent không được hard-code secret, token, password hoặc thông tin định danh cá nhân vào source code, tài liệu công khai hoặc log mẫu.

## Implementation Baseline / Nền bảo mật triển khai

Các kiểm soát bảo mật đã có trong foundation code được ghi tại [docs/implementation-foundation/security-baseline.md](docs/implementation-foundation/security-baseline.md). Module Authentication sẽ bổ sung JWT, role permission runtime và session/token lifecycle ở phase sau.
