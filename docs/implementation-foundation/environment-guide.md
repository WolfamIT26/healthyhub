# Environment Guide / Hướng dẫn môi trường

## Purpose / Mục tiêu

Environment Guide mô tả cách dùng biến môi trường cho foundation. Tất cả giá trị thật phải nằm ngoài Git; repository chỉ lưu file `.env.*.example`.

## Environment Files / File môi trường

| File | Nghĩa tiếng Việt | Cách dùng |
| --- | --- | --- |
| `.env.example` | Mẫu chung | Xem toàn bộ biến cần có |
| `.env.development.example` | Mẫu development | Tạo `.env.development` hoặc `.env` cho local |
| `.env.test.example` | Mẫu test | Dùng khi chạy test/integration |
| `.env.production.example` | Mẫu production | Checklist biến production, không chứa secret thật |

## Required Groups / Nhóm biến chính

- Application: `APP_NAME`, `APP_ENV`, `NODE_ENV`, `APP_URL`, `WEB_PORT`, `API_PORT`.
- API: `API_PREFIX`, `API_DOCS_PATH`, `CONTRACT_VERSION`.
- Web: `VITE_APP_NAME`, `VITE_API_BASE_URL`.
- Security: `CORS_ORIGINS`, `REQUEST_BODY_LIMIT`, `RATE_LIMIT_TTL_MS`, `RATE_LIMIT_LIMIT`, `LOG_REDACTION_KEYS`.
- Database: `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `TYPEORM_SYNCHRONIZE`, `TYPEORM_LOGGING`.
- phpMyAdmin: `PHPMYADMIN_PORT`.
- Reserved auth/gateway: biến JWT và provider gateway chỉ để chuẩn bị, chưa dùng cho nghiệp vụ.

## Validation Rule / Quy tắc validation

API foundation validate environment khi khởi động:

- `APP_ENV` chỉ nhận `development`, `test` hoặc `production`.
- Port phải là số nguyên dương và không vượt quá 65535.
- MySQL host, database, user và password là bắt buộc.
- Production không được dùng giá trị mẫu có dạng `change_me` hoặc `replace_with`.
- `TYPEORM_SYNCHRONIZE=true` chỉ được phép ở môi trường test.

## Secret Management / Quản lý secret

- Không commit `.env`, `.env.development`, `.env.test`, `.env.production`.
- File example được phép commit vì chỉ có giá trị mẫu.
- Production secret phải đặt trong secret manager, biến môi trường của host hoặc GitHub Secrets.
- Không ghi secret thật vào Dockerfile, Docker Compose, tài liệu, script hoặc log mẫu.

## Related Documents / Tài liệu liên quan

- [Environment Standard](../development-standards/environment-standard.md).
- [Security Baseline](security-baseline.md).
- [Docker Guide](docker-guide.md).
