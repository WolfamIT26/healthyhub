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

## Prompt 18.1 Unified Visual Report — 2026-08-07

Đã thống nhất visual cho `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` và trạng thái 403 bằng duy nhất `Authentication Banner.png`. Layout split cũ được thay bằng background toàn vùng và card bán trong suốt rộng tối đa 460px, đặt center-left từ tablet để không che mascot bên phải; mobile dùng card một cột có chiều rộng giới hạn theo viewport.

Các import `login-banner.png`, `register-banner.png` và `Hero Illustration.png` đã được gỡ khỏi Authentication frontend. Logo Symbol và state illustrations hiện hữu vẫn được dùng đúng ngữ cảnh; background quan trọng được tải eager, illustration trạng thái được lazy-load. Không có thay đổi Authentication logic, API call, route, backend, database, policy hoặc OpenAPI.

Kiểm tra trực tiếp responsive gồm login desktop 1440px, register tablet 820px, forgot-password mobile 390px, cùng reset-password và verify-email 1024px. Card, mascot/key visual, form labels và trạng thái invalid-token đều hiển thị đúng; public navigation được cho phép wrap trên mobile để không gây tràn ngang.

Frontend lint, typecheck, `build:web`, full build và `git diff --check` đạt. Test runner hiện bị chặn trước khi collect test trên Node 18.20.8 do dependency environment: CommonJS `html-encoding-sniffer` gọi ESM-only `@exodus/bytes`; cả hai lần chạy đều báo 6 worker errors và 0 test được nạp. Không thay dependency trong task visual này; bộ 6 files/18 tests đã đạt ở verification Prompt 18 trước đó nhưng không được khai báo là pass cho lần chạy hiện tại.

## Prompt 18.2 Centered Card & Glow Report — 2026-08-07

Đã căn giữa card của toàn bộ Authentication flows/states theo cả hai trục bằng flex. `PublicLayout` dùng flex-column và Authentication hero dùng `flex: 1`, nên hero bắt đầu ngay dưới header và tự lấy phần viewport còn lại mà không phụ thuộc header height cố định. Với Register hoặc viewport thấp, `min-height` và padding cho phép page tăng chiều cao, scroll tự nhiên, card vẫn được căn giữa theo vùng hero thực tế.

Banner dùng `<img>` overlay với `object-fit: contain`, `object-position: center`; không crop, kéo méo hoặc đổi asset. Nền gradient xanh kem gần palette banner lấp khoảng trống theo tỷ lệ viewport. Card tối đa 460px, mobile cách mép khoảng 16px, nền trắng bán trong suốt, blur nhẹ, radius 26px và shadow mềm.

Green glow dùng pseudo-element conic-gradient phía sau card, animate góc trong 5 giây linear infinite. Rule `prefers-reduced-motion: reduce` bỏ animation và giữ viền xanh tĩnh; glow không nhận pointer event và card content nằm ở stacking layer cao hơn.

Đã kiểm tra trực tiếp `/login` 1440px, `/reset-password` 1024px, `/register` 820px, `/forgot-password` 390px và `/verify-email` 820px. Card centered, banner giữ đủ artwork, state illustrations/form không đổi hành vi. Chrome headless trên macOS áp dụng minimum layout viewport lớn hơn 390px khi chụp file 390px; responsive mobile width vì vậy được xác minh bổ sung bằng CSS `calc(100vw - 2rem)` và build output.

## Prompt 18.3 Password UX & Policy Report — 2026-08-07

Đã thêm `PasswordField` dùng chung cho mọi password input hiện có trên web: Login, Register password/confirmation và Reset password/confirmation. Nút native `type="button"` dùng icon SVG nội bộ, `aria-label`/`aria-pressed`, keyboard activation và chặn mouse-down focus transfer; việc toggle chỉ đổi input type, không đổi/log value. Không có Change Password frontend screen hiện hữu nên không tạo route hoặc UI mới.

Policy helper trong `@healthyhub/shared-utils` giữ 12–128 ký tự và no-composition, mở rộng deny-list nhỏ đúng phạm vi, đồng thời so khớp NFKC/case-insensitive với full email, local-part từ 3 ký tự, full domain và domain label từ 4 ký tự. Cách suy ra này hoạt động với Gmail/Yahoo/Outlook/Hotmail/iCloud và domain khác, không hard-code provider; `@`, `.` và special characters vẫn hợp lệ khi không tạo email-derived match.

Backend là authoritative: Register truyền normalized email; Reset tra account từ token và validate trước khi consume; Change Password validate theo account email sau khi xác minh current credential. Login không áp creation policy. Không đổi JWT, refresh/cookie/CSRF/session, route guard, role/permission, schema, migration hoặc OpenAPI.

## Prompt 18.6 Email Verification Policy Report — 2026-08-07

Policy mới phân loại Customer là account chỉ có role `CUSTOMER`; account có bất kỳ role khác hoặc không có role được xử lý như Internal theo hướng deny-by-default. Customer pending/unverified được login, tạo session/JWT, refresh và nhận `actor.isEmailVerified=false`. Existing response dùng field `actor` thay vì `user`, nên cờ được thêm vào `ActorSummary` để không tạo response shape song song hoặc sửa OpenAPI.

Internal unverified nhận `AUTH.EMAIL_NOT_VERIFIED`; login attempt được audit `email_not_verified`, không tạo session/JWT. `EmailVerificationPolicyService` là điểm enforce dùng chung cho Forgot, Reset và Change Password. Checkout, Payment, Change Email, Delete Account và Recovery endpoint chưa tồn tại; implementation không dựng chức năng ngoài scope, nhưng policy helper/test đã xác định cơ chế bắt buộc để các module đó sử dụng sau này.

Frontend Customer area hiển thị sticky verification banner với verify/resend/dismiss; dismiss chỉ tồn tại trong component state nên reload hiển thị lại. `import.meta.env.DEV` bảo đảm hướng dẫn Development Tools không có trong production bundle. Verify route mở cho authenticated Customer; Forgot unverified hiển thị thông báo và link resend thay vì generic error/redirect.

Không thay JWT, refresh token, CSRF, cookie, session format/lifecycle, database schema, migration hoặc OpenAPI. API 9 files/40 tests và frontend 8 files/27 tests pass trên Node 20. Integration command chạy nhưng 1 file/3 tests skipped, không khai báo pass.
