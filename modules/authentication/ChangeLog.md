# ChangeLog / Nhật ký thay đổi Authentication

## [Unreleased] / Chưa phát hành

### Added / Thêm mới

- 2026-08-06: Tạo Context Pack Authentication gồm requirement, flow, rules, security, database, API, frontend, backend, testing, acceptance, dependency, plan và governance documents.
- 2026-08-06: Ghi mapping 10 endpoint, 4 bảng, actor/RBAC và shared contracts.
- 2026-08-06: Approved 10 P0 decisions về password, token, cookie/CSRF, account protection, response/error, tenant và retention.
- 2026-08-06: Thêm 2 TypeORM migrations, 9 entities, Authentication repository foundation, idempotent RBAC seed và 8 data-layer unit tests.
- 2026-08-06: Thêm Authentication shared contracts/enums/constants trong `packages/shared-types`.

### Changed / Thay đổi

- 2026-08-06: Cập nhật module index và work-summary index để đăng ký Context Pack.
- 2026-08-06: Đồng bộ Data Contract, API/flow, physical DB, UI Contract và OpenAPI; chuyển module sang `Ready for Implementation`.
- 2026-08-06: Chuyển trạng thái Prompt 16 sang `Implementation Complete - Database Verification Blocked` do Docker/MySQL chưa hoạt động.

### Fixed / Sửa lỗi

- Đổi Vitest config API sang `.mts` để test runner tương thích dependency ESM hiện tại; không đổi dependency.
# Change Log

## 2026-08-06 — Prompt 17

- Implemented Authentication NestJS controller, service, DTOs, guards, decorators and token/crypto layers.
- Added secure cookie/mobile refresh delivery, CSRF validation, RBAC foundation, account lock and audit events.
- Added notification gateway adapter and backend security unit tests.
- OpenAPI, `.spec`, frontend, Redis and Kafka remain unchanged.

## 2026-08-07 — Login User-Agent overflow fix

- Fixed `login_attempts.user_agent_family` overflow by persisting a bounded browser/client family instead of truncated raw User-Agent.
- Added regression coverage for Chrome, Safari, Firefox, Edge, missing and abnormal User-Agent values, plus failed-login attempt persistence.
- Kept the existing `VARCHAR(100)` migration/entity definition unchanged because specification and schema already match.

## 2026-08-07 — Prompt 18 Authentication Frontend

- Added Authentication pages, API client, memory session context/store, refresh handling and route guards.
- Added HttpOnly-cookie-compatible credential transport, CSRF header mirroring and `X-Client-Platform: web`.
- Added 18 frontend tests covering forms, restore, guards, refresh and safe errors.
- Recorded backend reset-cookie mismatch and full integration fixture blocker without changing backend/OpenAPI/policy.
