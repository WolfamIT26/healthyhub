# Dependency / Phụ thuộc Authentication

| Dependency | Need / Nhu cầu | Ownership / Sở hữu |
| --- | --- | --- |
| User | account, credential, status, tenant, roles, permissions; status admin API | User domain |
| Notification | gửi email verification/reset, retry/outbox result | Notification domain/gateway |
| Settings | approved password/token/lock/rate/retention policies | Settings/Security governance |
| Audit/Logging | immutable security events, request/trace context, redaction | Platform foundation |
| Database | MySQL, TypeORM, transaction runner, base audit | Implementation Foundation |
| Shared contracts | envelopes + auth DTO/type/error catalog | `packages/shared-types` |
| Web foundation | axios client, router, layouts, states/toast | `apps/web` |
| Security configuration | signing/encryption material via environment/secret manager | Deployment/platform |

## Shared Types Required / Kiểu dùng chung cần có

Request types: `AuthRegisterRequest`, `AuthLoginRequest`, `RefreshTokenRequest`, `TokenActionRequest`, `ResendVerificationRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`, `ChangePasswordRequest`.

Response/domain contract types: `AuthTokenPair` or approved delivery equivalent, `TokenMetadata` (type, issued/expires timestamps; no secret in resource), `AuthenticationSession`, `CurrentActor`, `CurrentSessionResponse`, `VerificationStatus`, `AuthenticationStatus`, `Role`, `Permission`, `EffectivePermissionScope`.

Error union/catalog dùng canonical dotted codes trong `.spec/data-contracts/authentication-contract.md`: invalid credentials, token invalid/expired/revoked/reused, account locked/disabled, duplicate email, password/reset invalid, rate limited và permission denied. Shared types phải dùng đúng catalog này; foundation mapper sẽ được cập nhật trong implementation.

## Dependency Order / Thứ tự

Approved decisions (complete) and User ownership -> database -> shared contracts -> backend security -> flows -> frontend -> tests/review -> documentation lock.
