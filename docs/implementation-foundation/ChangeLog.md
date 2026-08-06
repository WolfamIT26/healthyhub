# ChangeLog / Nhật ký thay đổi

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
