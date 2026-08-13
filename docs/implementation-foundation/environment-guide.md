# Environment Guide / Hướng dẫn môi trường

## Purpose / Mục tiêu

Environment Guide mô tả cách dùng biến môi trường cho foundation. Tất cả giá trị thật phải nằm ngoài Git; repository chỉ lưu file `.env.*.example`.

## Environment Files / File môi trường

| File | Nghĩa tiếng Việt | Cách dùng |
| --- | --- | --- |
| `.env.example` | Mẫu chung | Xem toàn bộ biến cần có |
| `.env.development.example` | Mẫu development | Tạo `.env.development` cho local |
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

## Development Runtime / Runtime development

`.env.development` tại workspace root là nguồn file chính cho `npm run dev`, các lệnh
Docker development và cả hai npm workspace. Biến do shell/host truyền trực tiếp vẫn có
độ ưu tiên cao hơn file theo convention chuẩn của Vite và `@nestjs/config`.

| Biến | Giá trị development | Consumer |
| --- | --- | --- |
| `WEB_PORT` | `3100` | Vite dev/preview listener, bật `strictPort` |
| `API_PORT` | `3001` | NestJS `app.listen` qua `HealthyHubEnvironment` |
| `APP_URL` | `http://localhost:3100` | Application URL phía API |
| `VITE_API_BASE_URL` | `http://localhost:3001/api/v1` | API client phía Web |
| `CORS_ORIGINS` | `http://localhost:3100` | NestJS credentialed CORS allowlist |
| `AUTH_ALLOWED_ORIGINS` | `http://localhost:3100` | Authentication origin allowlist |

Vite dùng `envDir` ở workspace root và `loadEnv` chỉ để đọc `WEB_PORT` cho build tool;
chỉ biến có prefix `VITE_` mới được expose vào client bundle. NestJS resolve file env từ
workspace root, validate bằng `HealthyHubEnvironment`, rồi bootstrap mới đọc listener port.
Không có dotenv loader song song.

Các lệnh `npm run docker:up`, `npm run docker:down` và `npm run docker:check` đều dùng
`.env.development`; Compose map host/container port và healthcheck từ cùng `WEB_PORT` /
`API_PORT`.

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
