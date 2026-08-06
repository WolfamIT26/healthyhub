# Implementation Foundation / Nền tảng triển khai

## Purpose / Mục tiêu

Thư mục này ghi lại phần foundation code được tạo ở Prompt 14. Đây là lớp nền chạy được cho HealthyHub trước khi bắt đầu module Authentication.

Phạm vi hiện tại chỉ gồm workspace, API bootstrap, web shell, shared packages, Docker, CI và kiểm tra chất lượng. Chưa có CRUD sản phẩm, đơn hàng, thanh toán, AI provider hoặc nghiệp vụ thương mại.

## Scope / Phạm vi

- Root npm workspace cho `apps/*` và `packages/*`.
- Backend foundation bằng NestJS trong `apps/api`.
- Frontend foundation bằng React, Vite, TypeScript và Tailwind CSS trong `apps/web`.
- Mobile placeholder trong `apps/mobile`.
- Shared packages gồm `shared-types`, `shared-utils` và `shared-config`.
- MySQL, TypeORM, Docker Compose và phpMyAdmin ở mức nền.
- CI/CD baseline bằng GitHub Actions.
- Security baseline trước khi có module Authentication.

## Main Files / File chính

| File / Thư mục | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `package.json` | Cấu hình workspace | Chạy dev/build/lint/test cho toàn monorepo |
| `tsconfig.base.json` | TypeScript gốc | Chuẩn TS dùng chung cho app và package |
| `eslint.config.mjs` | ESLint | Kiểm tra lỗi TypeScript/React/script |
| `.prettierrc.json` | Prettier | Chuẩn format file |
| `docker-compose.yml` | Docker Compose | Chạy web, API, MySQL và phpMyAdmin |
| `apps/api` | Backend foundation | NestJS API bootstrap, health check, gateway contracts |
| `apps/web` | Web foundation | React shell, route, layout, API client, state nền |
| `packages/shared-types` | Kiểu dữ liệu chung | API envelope, pagination, error, enum, metadata |
| `packages/shared-utils` | Utility chung | Request ID, API error guard, redaction helper |
| `packages/shared-config` | Cấu hình chung | API prefix, header, locale, timezone, sensitive keys |
| `scripts` | Script kiểm tra | OpenAPI, docs, secret và Docker startup check |

## Reading Order / Thứ tự đọc

1. [Setup Guide / Hướng dẫn setup](setup-guide.md).
2. [Environment Guide / Hướng dẫn môi trường](environment-guide.md).
3. [Docker Guide / Hướng dẫn Docker](docker-guide.md).
4. [Security Baseline / Nền bảo mật](security-baseline.md).
5. [Checklist / Checklist](Checklist.md).
6. [Report / Báo cáo](Report.md).
7. [Status / Trạng thái](Status.md).
8. [ChangeLog / Nhật ký thay đổi](ChangeLog.md).

## Runtime Endpoints / Endpoint nền

| Endpoint | Mục tiêu |
| --- | --- |
| `GET /api/v1/health/live` | Kiểm tra API process còn sống |
| `GET /api/v1/health/ready` | Kiểm tra API sẵn sàng và database kết nối được |
| `GET /api/v1/health` | Tổng hợp live/ready |
| `GET /api/docs` | Swagger UI sinh từ OpenAPI foundation |
| `GET /api/docs/openapi.yaml` | File OpenAPI chính thức dùng chung |

## Rule / Quy tắc

Mọi module nghiệp vụ sinh sau Prompt 14 phải dùng foundation này thay vì tự tạo app riêng. Nếu cần thêm package hoặc thay đổi stack, phải tạo ADR trước.
