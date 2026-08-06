# Security Baseline / Nền bảo mật

## Purpose / Mục tiêu

Security Baseline ghi lại các kiểm soát bảo mật đã có ở foundation trước khi triển khai Authentication. Đây là lớp bảo vệ chung cho API và web shell.

## API Controls / Kiểm soát API

- Environment validation khi khởi động.
- Helmet bật secure HTTP headers.
- CORS allowlist bằng `CORS_ORIGINS`.
- Body limit bằng `REQUEST_BODY_LIMIT`.
- Global validation pipe dùng whitelist và reject field ngoài hợp đồng.
- Exception filter trả response envelope theo chuẩn Data Contract.
- Production error không trả stack trace cho client.
- Request ID và trace ID được chuẩn hóa qua header.
- Rate-limit foundation theo IP và path.
- Structured logging có redaction key.

## Web Controls / Kiểm soát Web

- API base URL lấy từ biến môi trường `VITE_API_BASE_URL`.
- API error normalization để UI không xử lý lỗi thô.
- Error Boundary để tránh crash toàn app shell.
- Route Guard foundation để chuẩn bị phân quyền theo role.
- UI tiếng Việt và không hiển thị thông tin debug nhạy cảm.

## Database Controls / Kiểm soát Database

- TypeORM `synchronize` mặc định tắt.
- Migration và seed chạy qua script riêng.
- Base audit entity chuẩn bị `created_at`, `updated_at`, `deleted_at`, actor fields và `version`.
- Transaction runner chuẩn hóa cách gom thao tác database sau này.

## Not Implemented Yet / Chưa triển khai

- JWT Authentication chưa triển khai vì thuộc module Authentication.
- Role Permission runtime chưa triển khai vì cần Authentication/User module.
- Payment, storage, notification và AI provider thật chưa tích hợp.
- CSRF policy chi tiết sẽ áp dụng khi có form/auth flow cụ thể.

## Required Checks / Kiểm tra bắt buộc

- Chạy `npm run secrets:check` trước khi commit.
- Chạy `npm run audit:deps` định kỳ hoặc trước release.
- Kiểm tra `git diff --check` để tránh whitespace lỗi.
- Không ghi password/token/secret vào log, docs hoặc sample ngoài `.env.*.example`.

## Related Documents / Tài liệu liên quan

- [Security Policy](../../SECURITY.md).
- [Security Standard](../development-standards/security-standard.md).
- [Environment Guide](environment-guide.md).
