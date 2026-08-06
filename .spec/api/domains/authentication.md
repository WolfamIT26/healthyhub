# Authentication API Specification V1 / Đặc tả API xác thực V1

## Metadata / Thông tin

- Version: `1.1.0`; public route/contract remains `/api/v1` and `v1`.
- Approved: 2026-08-06.
- Contract authority: `.spec/data-contracts/authentication-contract.md`.

## Endpoint List / Danh sách endpoint

| Method | URI | Success data | Auth / permission | Rate / idempotency |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | Register result; 201 | Public | Very Strict / key recommended |
| POST | `/api/v1/auth/login` | Authentication result; 200 | Public | Very Strict / no key |
| POST | `/api/v1/auth/refresh` | Refresh result; 200 | Web refresh cookie + CSRF, or Mobile refresh header / owner | Strict / no key; rotation is atomic |
| POST | `/api/v1/auth/logout` | Revoked status; 200 | Bearer / session owner | Strict / idempotent |
| POST | `/api/v1/auth/verify-email` | Verification result; 200 | One-time body token / token owner | Very Strict / no key |
| POST | `/api/v1/auth/resend-verification` | Accepted result; 200 | Public with email, or optional Bearer / account owner | Very Strict / no key |
| POST | `/api/v1/auth/forgot-password` | Accepted result; 200 | Public | Very Strict / no key |
| POST | `/api/v1/auth/reset-password` | Password reset result; 200 | One-time body token / token owner | Very Strict / no key |
| POST | `/api/v1/auth/change-password` | Password change result; 200 | Bearer / account owner | Strict / no key |
| GET | `/api/v1/auth/session` | Current session; 200 | Bearer / session owner | Standard / no key |

No endpoint is added beyond V1. Admin account status remains `PATCH /api/v1/admin/users/{userId}/status` in User domain (`users:manage`). Session revocation is an Authentication capability invoked by logout, password/account security events and authorized User-domain operations.

## Identifier & Password / Định danh và mật khẩu

V1 login identifier is email only. Server trims and lowercases before lookup; maximum 254 characters and globally unique in single-tenant V1. Username/phone login is out of scope. Password input follows the 12–128 character and Argon2id policy in the Authentication Data Contract.

## Token Transport / Truyền token

- Access token: Bearer JWT, 15 minutes in every environment, returned in login/refresh JSON and held in Web memory only.
- Web refresh: opaque token in `__Host-hh_refresh` cookie (`HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`). Production 30 days; Development 7 days. Never returned in Web JSON.
- Mobile refresh: same opaque token model, returned only to a request explicitly identified as mobile and stored in secure OS storage; sent in `X-Refresh-Token` to the same refresh endpoint.
- Web refresh requires signed double-submit `X-CSRF-Token` and trusted Origin/Referer. Credentialed CORS uses exact environment origins, never wildcard.
- Login/refresh set or rotate the cookie; logout/reset clear it; change password rotates current session after revoking other sessions. Token responses are `Cache-Control: no-store`.

## Token & Account Policy / Policy token và account

| Setting | Production default | Development default | Environment-configured |
| --- | --- | --- | --- |
| Access token | 15 minutes | 15 minutes | Yes |
| Refresh/session | 30 days | 7 days | Yes |
| Password reset token | 30 minutes | 30 minutes | Yes |
| Email verification token | 24 hours | 24 hours | Yes |
| Login tracking window | 15 minutes | 15 minutes | Yes |
| Temporary lock | 15 minutes after 5 failures | same | Yes |

Account must be active and email verified to login/refresh. Public login still returns one generic invalid-login message for wrong credential, nonexistent, disabled, locked or unverified accounts. Internal audit records the precise reason. Rate limiting combines IP and normalized-identifier keyed hash; thresholds are at most 5 failed logins per identifier/window and an operational IP ceiling configured by environment. Successful login resets the rolling identifier failure counter but not audit history.

## Session & Rotation / Phiên và rotation

Refresh tokens are random opaque 256-bit values. Database stores only SHA-256 hash of the random token, session public ID, token family and generation. Each refresh atomically invalidates the previous generation and issues a new token. Any older/revoked generation reuse marks the family compromised, revokes the session and requires login. Password reset/account disable or lock revokes all sessions; password change revokes other sessions and rotates current; role/permission change increments `permissionsVersion` and sensitive authorization reads current permissions.

Session metadata is minimized to device label, platform and browser family; full User-Agent is not retained. IP is stored only as keyed hash for rate/audit correlation.

## Response & Error Contract / Contract response và lỗi

Every response uses the standard API envelope and the dedicated data shapes in `.spec/data-contracts/authentication-contract.md`. Web JSON never includes a refresh token. No response contains password/hash/raw reset or verification secret. Forgot/resend always return accepted data for syntactically valid email.

Canonical error codes and HTTP mappings are the Authentication Data Contract catalog. Endpoint-specific errors are 400 malformed/invalid one-time reset token, 401 invalid credential/token, 403 permission/explicit disabled state for authenticated contexts, 409 duplicate email, 422 validation/password policy, 423 temporary lock when safe in authenticated/admin context, 429 rate limit and 500 system error. Public login may collapse account-state failures into `AUTH.AUTHENTICATION.INVALID_CREDENTIALS`/401.

## Roles & Permissions / Vai trò và quyền

Guest is not persisted. V1 stored roles are Customer, Staff, Manager and Administrator; registration assigns Customer. Super Admin is reserved and not seeded/assignable in V1. User domain owns roles/permissions and their many-to-many mapping. Access token carries role codes plus `permissionsVersion`, not the permission list; backend computes effective permissions. `users:manage` locks/unlocks/disables accounts; `sessions:manage` revokes another user's/all sessions; owner may revoke current session.

## Audit / Audit

Audit register, login success/failure/rate/lock, session create/refresh/reuse/revoke/logout, verification send/complete, password request/reset/change and privileged role/permission/account changes. Store request/trace, actor/user/session references, result and minimized device/IP-hash context; never credential or token raw.
