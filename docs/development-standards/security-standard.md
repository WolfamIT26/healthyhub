# Security Standard / Chuẩn bảo mật

## Purpose / Mục tiêu

Security Standard áp dụng cho mọi code HealthyHub ở frontend, backend, database, gateway và AI Layer. Bảo mật phải được kiểm tra trước khi module được đánh dấu hoàn thành.

## Secret Environment / Secret và môi trường

- Không commit `.env`, secret, credential, token hoặc private key.
- Luôn có `.env.example` tương ứng khi thêm biến môi trường mới.
- Secret production phải nằm ngoài repository.
- Secret rotation cần có guideline khi triển khai thật.

## Authentication Authorization / Xác thực và phân quyền

- Password phải hash bằng thuật toán phù hợp ở phase implementation.
- JWT access token và refresh token phải có thời hạn, rotation và revoke strategy.
- RBAC và permission phải kiểm ở backend, không tin frontend.
- Role/permission không hardcode rải rác; phải bám specification và policy.

## Input Output Protection / Bảo vệ input/output

- Validate và sanitize input.
- Chống SQL Injection bằng query parameterization/ORM pattern được duyệt.
- Chống XSS bằng escaping/rendering an toàn ở frontend.
- CSRF cần xử lý nếu dùng cookie/session.
- CORS dùng allowlist, không mở rộng tùy tiện.
- Upload phải kiểm type, size, extension, storage path và quyền truy cập.

## Logging Privacy / Logging và riêng tư

- Không log token, password, secret, credential, raw payment data hoặc dữ liệu cá nhân không cần.
- Audit log cho hành động quản trị quan trọng.
- AI prompt/log phải giảm thiểu dữ liệu cá nhân.

## Dependency Security / Bảo mật dependency

- Dependency mới phải có lý do và kiểm tra license/security.
- Chạy dependency audit theo workflow khi có công cụ.
- Không thêm package để giải quyết việc nhỏ nếu standard library hoặc stack hiện tại đáp ứng.

## Security Headers Rate Limit / Header bảo mật và rate limit

- API public, auth, AI và webhook phải có rate limit phù hợp.
- Security headers cần được cấu hình ở backend/gateway/deployment phase.
- Error bảo mật không được lộ thông tin tồn tại của tài nguyên nếu user không có quyền.

