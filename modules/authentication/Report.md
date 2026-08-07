# Report / Báo cáo Prompt 16 Authentication Data Layer

## Outcome / Kết quả

Đã hoàn thành implementation migration/entity/repository/shared contracts và unit tests. Không tạo controller, AuthService nghiệp vụ, endpoint runtime, React UI hoặc thay đổi specification/OpenAPI. Trạng thái là `Implementation Complete - Database Verification Blocked` vì Docker/MySQL không hoạt động.

## Migrations / Migration

- `1760000000000-create-user-identity-foundation.ts`: 5 bảng User-owned identity/RBAC tối thiểu.
- `1760000001000-create-authentication-data.ts`: 4 bảng Authentication, rotation/reuse/expiry/privacy metadata.
- Mỗi migration có `up/down`, named FK/unique/index/check và reverse dependency rollback. Không seed data trong schema migration.

## Entities / Entity

Tạo 9 TypeORM entities: UserAccount, Role, Permission, RolePermission, UserRoleAssignment, AuthenticationSession, LoginAttempt, PasswordResetRequest và AccountVerification. Tất cả dùng BaseAudit/optimistic version; sensitive hashes `select: false` + serialization exclusion; relation không eager.

## Repository & Seed / Repository và seed

Tạo interface/token `AuthenticationRepository`, TypeORM implementation cho account/session/rotation/revoke/one-time-token/login-attempt/RBAC reads, và seed idempotent 4 roles + 2 permissions. Seed không tạo Super Admin hoặc tài khoản mặc định.

## Shared Contracts / Contract dùng chung

Tạo request/result/envelope types, actor/session/token metadata, AccountStatus, SessionStatus, TokenPurpose, RoleName, PermissionName và 12 canonical Authentication error codes trong `packages/shared-types/src/authentication.ts`.

## Verification / Xác minh

Pass: shared build/typecheck/lint; API lint/typecheck/build; 4 unit test files/8 tests; hash serialization/selection; migration structure/down order; seed upsert contract; repository normalized-email method. Vitest config được đổi `.ts` sang `.mts` để tương thích ESM hiện tại.

Blocked: `docker compose ps` không kết nối được Docker daemon; `migration:show` đã build rồi fail kết nối `127.0.0.1:3306` với `EPERM`. Vì vậy migration run/revert và MySQL unique/FK/check/rollback integration chưa chạy. Không khai báo pass cho phần này.

## Specification Integrity / Toàn vẹn specification

Không thay đổi `.spec` hoặc `openapi`. Không thay đổi approved policy, không thêm dependency/framework, không tạo secret/token/password fixture thật.

## Runtime Bug Fix — 2026-08-07

Điều tra lỗi login xác nhận raw `request.headers['user-agent']` được truyền vào request context rồi cắt 120 ký tự trước khi ghi `login_attempts.user_agent_family`, trong khi entity và migration cùng quy định `VARCHAR(100)`. Đây là lỗi application mapping, không phải schema mismatch.

Đã thay raw User-Agent bằng browser/client family ngắn gọn (`Chrome`, `Safari`, `Firefox`, `Edge`, `Unknown`) và giới hạn phòng vệ 32 ký tự trước persistence. Không sửa migration, Authentication policy hoặc OpenAPI; không thêm dependency.

## Prompt 18 Frontend Report — 2026-08-07

Authentication frontend V1 đã triển khai forms, API client, memory-only access token, session restore, coordinated refresh, cookie/CSRF transport, logout, guest/protected guards và role/permission foundation. Frontend tests 6 files/18 tests pass.

HTTP smoke test xác nhận `/login` trả 200 và API local trả credentialed CORS preflight 204 cho `http://localhost:3000`. Full flow bị chặn vì local notification adapter không gửi/expose verification token và không có verified test fixture; không bypass account verification.

Backend mismatch ghi nhận, không tự sửa: reset-password revokes sessions nhưng controller hiện chưa clear refresh/CSRF cookies trong HTTP response như Data Contract mô tả. Frontend xóa memory state; cookie cũ không refresh được sau revoke, nhưng backend vẫn cần correction ở task riêng.
