# Status / Trạng thái

## Current Status / Trạng thái hiện tại

Prompt 14 đã tạo foundation workspace cho HealthyHub. Phần build/lint/typecheck/test/OpenAPI/docs/secret đã pass; Docker/API ready đang bị chặn bởi môi trường local.

Update 2026-08-13: port development đã dùng một authority duy nhất từ
`.env.development`. Web bind `3100` qua `WEB_PORT`, API bind `3001` qua `API_PORT`, Vite
`strictPort` đã được xác minh và API health/CORS smoke đều pass.

## Completed / Đã hoàn thành

- Root npm workspace đã có cấu hình build, lint, format, typecheck, test và Docker scripts.
- `apps/api` đã có NestJS bootstrap, config validation, TypeORM config, health endpoint, Swagger/OpenAPI integration, exception filter, response envelope, request context, logging, CORS, Helmet và rate-limit foundation.
- `apps/web` đã có React/Vite/Tailwind shell, router, layouts public/customer/admin, route guard foundation, error boundary, loading, empty state, toast và Axios client.
- Shared packages đã có types, utils và config dùng chung.
- Docker Compose đã có web, API, MySQL và phpMyAdmin.
- GitHub Actions đã có CI/test/deploy workflow nền.
- Tài liệu implementation foundation đã được gom tại `docs/implementation-foundation`.

## Not Implemented / Chưa triển khai

- Chưa có module Authentication.
- Chưa có CRUD sản phẩm, danh mục, đơn hàng, thanh toán hoặc AI nghiệp vụ.
- Chưa có bảng nghiệp vụ, migration nghiệp vụ hoặc ORM entity nghiệp vụ.
- Chưa có provider thật cho gateway AI/payment/storage/notification.

## Verification Status / Trạng thái kiểm tra

- Pass: format check, lint, typecheck, test, integration test, build, OpenAPI validation, docs check, secret check, `git diff --check`.
- Pass: Web dev server start và trả HTTP 200 ở `http://127.0.0.1:3100`; lần bind thứ hai fail rõ do `strictPort`.
- Pass: API dev server đọc `API_PORT` và trả HTTP 200 ở `http://127.0.0.1:3001/api/v1/health/live`.
- Pass: Docker Compose config resolve Web `3100:3100`, API `3001:3001` và các URL/origin từ `.env.development`.
- Blocked: chưa xác minh container runtime MySQL/phpMyAdmin trong lần cập nhật port này.
- Needs follow-up: `npm audit` chạy được, đã giảm từ 9 xuống 4 high vulnerabilities; phần còn lại nằm ở `@nestjs/swagger` kéo `js-yaml@5.2.1` và React Router audit range hiện tại.
