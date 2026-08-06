# Prompt 16 - Authentication Data & Shared Contracts / Dữ liệu và contract Authentication

## Task / Nhiệm vụ

Triển khai migration, TypeORM entities, repository/data-access foundation, shared TypeScript contracts, seed và database-layer tests cho Authentication V1.

## Summary / Tóm tắt

Đã tạo 2 migrations, 9 entities, Authentication repository interface/TypeORM implementation, seed 4 roles + 2 permissions và Authentication contracts. Không tạo runtime endpoint, AuthService/controller hoặc UI.

## Added / File đã thêm

- User/Auth entities và repository dưới `apps/api/src/data`.
- Hai migrations và migration/entity/repository/seed tests.
- `packages/shared-types/src/authentication.ts` và package README.

## Updated / File đã cập nhật

- API seed, Vitest config/package script và API README.
- Authentication module Database/Backend/Status/Report/Checklist/ChangeLog/TODO/ImplementationPlan.
- Database/shared documentation, root ChangeLog và `TONG_HOP_DA_LAM.md`.

## Verification / Kiểm tra

- 4 test files, 8 tests pass.
- API and shared-types lint/typecheck/build pass.
- Docker daemon unavailable; `migration:show` build thành công nhưng kết nối MySQL `127.0.0.1:3306` bị `EPERM`, nên run/revert và integration blocked.
- Final format/secrets/docs/diff checks được chạy sau documentation update.

## Specification Integrity / Toàn vẹn specification

Không thay đổi `.spec`, OpenAPI hoặc approved Authentication decisions. Không có secret thật hay admin account mặc định.
