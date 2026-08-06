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

- 7 unit test files / 19 tests pass, bao phủ Argon2id hash/verify, password policy, email normalization, keyed identifier digest, CSRF signing/tamper detection, JWT issuer/audience/signature, generic recovery, hash-only reset token, refresh reuse và logout revoke.
- Entity, repository, seed và migration construction tests từ Prompt 16 tiếp tục chạy.
- Typecheck, lint và Nest build được chạy bằng Node 20.

## Blocked integration verification

MySQL/Docker không khả dụng trong môi trường hiện tại, nên 3 database integration tests bị skip và chưa thể xác nhận migration up/down, unique/FK/transaction behavior và HTTP integration với MySQL 8. Đây là blocker xác minh tích hợp, không phải blocker code backend.
