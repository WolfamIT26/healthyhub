# ChangeLog / Nhật ký thay đổi

## [0.3.1] - 2026-08-13

### Fixed / Đã sửa

- Vite đọc `WEB_PORT` từ `.env.development`, bỏ CLI/config hard-code và bật `strictPort`.
- NestJS resolve env từ workspace root, giữ raw keys sau validation và bind `API_PORT` qua `HealthyHubEnvironment`.
- Docker Compose/scripts dùng cùng env authority cho listener, mapping, healthcheck, URL và origin.

### Verification / Kiểm tra

- Web `3100`, API `3001`, CORS `3100`, Compose config, lint/typecheck/test/build đều pass.
- Không thay đổi business logic hoặc API contract.

## [0.3.0] - 2026-08-06

### Added / Đã thêm

- Tạo Implementation Foundation cho HealthyHub.
- Tạo workspace scripts, TypeScript base, ESLint, Prettier và Docker baseline.
- Tạo NestJS API foundation trong `apps/api`.
- Tạo React/Vite web foundation trong `apps/web`.
- Tạo shared packages trong `packages/shared-types`, `packages/shared-utils` và `packages/shared-config`.
- Tạo Dockerfile API/Web và Compose stack web/API/MySQL/phpMyAdmin.
- Tạo scripts kiểm tra OpenAPI, docs, secret và Docker startup.
- Tạo tài liệu vận hành tại `docs/implementation-foundation`.

### Notes / Ghi chú

- Không tạo code nghiệp vụ.
- Không tạo endpoint nghiệp vụ ngoài health/docs.
- Không tạo migration hoặc bảng nghiệp vụ.
- Không tích hợp provider thật cho gateway.
- Verification source/config pass; Docker/API runtime còn bị chặn bởi Docker daemon và credential MySQL local.
