# Checklist / Checklist Authentication

## Specification Mapping / Ánh xạ đặc tả

- [x] Scope V1 và out-of-scope được chuẩn hóa.
- [x] Guest, Customer, Staff, Manager, Administrator, Super Admin được mapping.
- [x] Public/authenticated/role/permission/admin-only được phân biệt.
- [x] 11 flow (gồm account lock và session revocation) có pre/input/process/output/security/failure/audit/rate limit.
- [x] 4 Authentication tables và User-domain ownership được mapping.
- [x] 10 Authentication endpoints + adjacent status/RBAC APIs được mapping.
- [x] Login/Register/Forgot/Reset/Verify/session-expired/401/403 UI được mapping.
- [x] Shared request/response/token/session/role/permission/error types được liệt kê.
- [x] Implementation plan có 18 task, allowlist, dependency, acceptance và command.

## Security / Bảo mật

- [x] Hashing, token lifecycle/rotation/storage/revoke, one-time token và constant-time requirement được ghi.
- [x] Brute-force, attempt tracking, lock, generic error, redaction và audit được ghi.
- [x] Cookie/CORS/CSRF options và blocker được ghi; không tạo secret/value production.
- [x] P0 policy values và transport được phê duyệt trong Prompt 15.5.

## Conflict & Governance / Mâu thuẫn và quản trị

- [x] Conflict/gap nằm trong `Report.md` và pending decisions trong `Decision.md`.
- [x] Blockers được đánh dấu trong `Status.md`.
- [x] Chỉ đưa một phương án ưu tiên cho mỗi pending decision.
- [x] Không sửa Business Blueprint, DB spec, API spec hoặc OpenAPI.
- [x] Không tạo code, SQL, migration, entity hoặc UI implementation.
- [x] Module index và work-summary index được cập nhật.
- [x] `git diff --check` sạch.

## Unlock / Mở khóa

- [x] 10/10 P0 decisions Approved, không còn blocker migration/code.
- [x] Data Contract/Auth API/flow/physical DB/UI/OpenAPI được cập nhật đúng authority.
- [x] Web cookie/CSRF/CORS và Mobile refresh header được chốt.
- [x] Response/error/request/security schemes và examples đồng bộ.
- [x] OpenAPI YAML, refs, 194 operationIds và operation count hợp lệ.
- [x] Status là `Ready for Implementation`.

## Implementation / Triển khai

- [x] Hai TypeORM migrations có up/down và đúng ownership.
- [x] 9 entities khớp migration; hash không default-select/serialize.
- [x] Repository/transaction foundation đủ cho Prompt 17.
- [x] Shared request/response/session/RBAC/error contracts được tạo.
- [x] Seed role/permission idempotent, không tạo admin account.
- [x] API/shared lint, typecheck, build và 8 unit tests đạt.
- [ ] Migration up/down + constraint integration trên MySQL (Docker daemon unavailable).
- [ ] Backend runtime/frontend/tests còn lại được triển khai theo plan.
- [ ] Security review hoàn tất.
- [ ] Acceptance đủ và module lock.
# Prompt 17 Checklist

- [x] 10 Authentication operationId được nối vào NestJS controller
- [x] Argon2id, JWT, opaque refresh rotation/reuse detection
- [x] Web cookie, mobile header, CSRF và exact-origin validation
- [x] Generic login/forgot/resend behavior và account lock
- [x] Access guard, roles decorator/guard, current session
- [x] Password reset/change và session revocation
- [x] Structured audit events và notification gateway stub
- [x] Unit test, typecheck, lint, build
- [ ] MySQL migration + HTTP integration verification (environment blocked)

# Prompt 18 Checklist

- [x] Login/Register/Forgot/Reset/Verify UI theo UI Contract
- [x] `fullName`, confirm-password client-only và password policy validation
- [x] Memory-only access token; refresh token không vào JS storage
- [x] Credentialed Axios, web client header, CSRF cookie mirror
- [x] Single-flight refresh và one-retry protection
- [x] Session restore, logout, session-expired state
- [x] Guest/protected/customer/admin guards và permission foundation
- [x] Vietnamese safe error mapping, 401/403/network/rate-limit handling
- [x] Responsive/accessibility styles và labels
- [x] 6 frontend test files / 18 tests pass
- [x] Web/API HTTP+CORS smoke test
- [ ] Full verified-account integration flow (test fixture/notification delivery blocked)

# Prompt 18.1 Unified Visual Checklist

- [x] Chỉ dùng `Authentication Banner.png` cho mọi standalone Authentication page/state
- [x] Thay split layout bằng floating translucent card responsive, tối đa 460px
- [x] Card center-left trên tablet/desktop và không che mascot/key visual bên phải
- [x] Logo Symbol và HealthyHub wordmark lớn hơn nằm trong card
- [x] State illustrations giữ đúng ngữ cảnh và lazy-load
- [x] Gỡ import login/register/Hero banner cũ, không xóa hoặc đổi tên asset
- [x] Giữ nguyên Authentication logic, API, route, backend, database, policy và OpenAPI
- [x] Kiểm tra trực tiếp đủ 5 route ở desktop/tablet/mobile
- [ ] Chạy lại 6 files/18 frontend tests sau khi xử lý xung đột jsdom ESM trên Node 18

# Prompt 18.2 Centered Card Checklist

- [x] Card căn giữa ngang và dọc bằng flex ở mọi breakpoint
- [x] Register dài vẫn căn giữa hợp lý và page scroll khi viewport thấp
- [x] Card responsive tối đa 460px, mobile cách viewport khoảng 16px
- [x] Animated green conic-gradient glow nhẹ, không che nội dung
- [x] `prefers-reduced-motion` tắt animation và giữ viền xanh tĩnh
- [x] Banner dùng `object-fit: contain`, giữ nguyên tỷ lệ và không crop artwork
- [x] Khoảng trống từ `contain` dùng gradient gần màu banner
- [x] Hero tự lấy phần viewport còn lại sau header, không hardcode header height
- [x] Giữ nguyên header navigation, route/link/menu
- [x] Kiểm tra trực tiếp 5 Authentication routes ở các breakpoint yêu cầu
- [x] Không thay Authentication logic, API, validation, route guard, backend hoặc asset

# Prompt 18.6 Email Verification Policy Checklist

- [x] Pending Customer login thành công, có JWT/session và `isEmailVerified=false`
- [x] Customer pending refresh/session policy được cho phép
- [x] Internal unverified bị `AUTH.EMAIL_NOT_VERIFIED`, không cấp JWT/session
- [x] Verified Customer/Internal được sử dụng bình thường
- [x] Forgot, Reset và Change Password bắt buộc verified email qua helper dùng chung
- [x] Checkout/Payment/Change Email/Delete/Recovery được ghi contract dùng helper khi endpoint tồn tại
- [x] Banner Customer unverified có verify, resend, dismiss tạm và hiện lại sau reload/remount
- [x] Development-only mail provider guidance không xuất hiện production
- [x] `/verify-email` truy cập được khi Customer đã authenticated
- [x] Không sửa JWT, refresh, cookie, CSRF, session architecture, schema, migration hoặc OpenAPI
- [x] API 9 files/40 tests và frontend 8 files/27 tests pass
- [ ] Integration database: 1 file/3 tests skipped do môi trường
