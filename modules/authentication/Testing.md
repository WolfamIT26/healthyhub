# Testing / Kiểm thử Authentication

## Unit Tests / Unit test

- Email normalization, password-policy validator, account-state decision.
- Hash verification without timing-sensitive shortcut; token hashing/constant-time comparison.
- Access claims/expiry and refresh rotation/reuse/revoke state machine.
- One-time reset/verification expiry and replay rejection.
- Role/effective-permission guards; 401 versus 403.
- Generic error mapper/redaction and rate-limit key/policy.

## Integration Tests / Integration test

- Repository constraints/index-driven queries and tenant isolation.
- Register transaction/duplicate race; login attempt persistence.
- Concurrent refresh: only one succeeds, reuse revokes family per approved policy.
- Logout repeated safely; reset/change/lock revoke correct sessions.
- Notification failure/outbox behavior; audit event completeness without secrets.
- OpenAPI request/response conformance and error envelope codes.

## E2E Tests / Kiểm thử đầu cuối

Register -> verify -> login -> session -> refresh -> logout; forgot -> reset -> old credential/session rejected -> new login; change password; locked/disabled account denial; Customer/Admin redirect; unauthenticated/forbidden/session-expired handling; mobile keyboard/focus and accessibility checks.

## Security Tests / Kiểm thử bảo mật

Enumeration response/timing review, brute-force per IP+identifier, token replay/reuse, CSRF/CORS/cookie attributes if cookies selected, XSS impact on token storage, algorithm/claim confusion, tenant/owner bypass, privilege escalation, log/trace/database secret scan and dependency audit.

## Verification Commands / Lệnh xác minh dự kiến

`npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:integration`, project E2E command once introduced, `npm run openapi:validate`, `npm run docs:check`, `npm run secrets:check`, `npm run audit:deps`, and `git diff --check`.

No test/code was created in this documentation phase.
# Authentication Testing

## Automated verification

- 8 unit test files / 26 tests pass, bao phủ Argon2id hash/verify, password policy, email normalization, keyed identifier digest, CSRF signing/tamper detection, JWT issuer/audience/signature, generic recovery, hash-only reset token, refresh reuse, logout revoke và User-Agent family normalization.
- Prompt 18.3: API 8 files/30 tests pass trên Node 20, gồm password policy theo email cho Register/Reset/Change. Frontend 7 files/24 tests pass trên Node 20, gồm show/hide mặc định, toggle hai chiều, giữ focus/value, keyboard activation, email-derived/common-password rejection và strong password chứa `@` không liên quan email.
- Prompt 18.6: API 9 files/40 tests pass, bao phủ pending Customer login/JWT-session, pending Internal denial, verified Internal login, sensitive-action policy, Forgot/Reset/Change denial và resend. Frontend 8 files/27 tests pass, bao phủ banner/resend/dismiss-remount và Forgot verification guidance.
- Entity, repository, seed và migration construction tests từ Prompt 16 tiếp tục chạy.
- Typecheck, lint và Nest build được chạy bằng Node 20.
- Regression tests cho Chrome User-Agent dài, Safari, Firefox, thiếu User-Agent, dữ liệu bất thường/rất dài và Edge precedence. Service test xác nhận failed-login attempt vẫn được ghi với `userAgentFamily: Chrome`.

## Blocked integration verification

MySQL/Docker không khả dụng trong môi trường hiện tại, nên 3 database integration tests bị skip và chưa thể xác nhận migration up/down, unique/FK/transaction behavior và HTTP integration với MySQL 8. Đây là blocker xác minh tích hợp, không phải blocker code backend.

Prompt 18.6 integration command exit 0 nhưng 1 file/3 tests đều skipped; không được tính là integration pass.

## Prompt 18 Frontend Verification

- 6 files / 18 tests pass: login success/failure, register validation/success, forgot generic success, reset missing token, session restore/failure, protected/guest/admin guards, refresh success/failure, 401/403 và network error.
- Root lint/typecheck, `build:web`, full root build, secrets check và `git diff --check` pass.
- Local HTTP smoke: `/login` 200; API CORS preflight 204 với exact origin và credentials.
