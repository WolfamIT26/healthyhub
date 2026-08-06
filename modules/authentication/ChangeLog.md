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
