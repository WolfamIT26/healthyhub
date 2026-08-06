# Security / Bảo mật Authentication V1

## Approved Baseline / Baseline đã duyệt

- Password: 12–128 Unicode characters, no composition; local common-password denylist. Argon2id minimum 19 MiB, 2 iterations, parallelism 1; unique salt; benchmark upward per environment.
- Access JWT: 15 minutes; keys/secrets from environment/secret management; validate algorithm, issuer, audience, expiry, subject and session. Claims include role codes + `permissionsVersion`, never full permission list.
- Refresh: opaque random 256-bit; SHA-256 hash only in DB; Prod 30 days/Dev 7 days; family/generation rotation on every use. Reuse revokes compromised family and requires login.
- Reset 30 minutes; email verification 24 hours; hash-only, single use and constant-time comparison. Reset revokes all sessions.
- Five identifier failures in 15 minutes locks for 15 minutes. Combine keyed identifier/IP buckets; exact operational IP ceiling is environment-configured at or stricter than approved deployment capacity.

## Web & Mobile Transport / Truyền token

Web keeps access token in memory and refresh in `__Host-hh_refresh` with `HttpOnly; Secure; SameSite=Lax; Path=/`, no Domain. Web refresh uses signed double-submit `X-CSRF-Token` plus exact Origin/trusted Referer. CORS credentials are enabled only for an exact environment allowlist, never `*`. Token responses use `Cache-Control: no-store`. No auth token enters localStorage/sessionStorage.

Future Mobile stores access/refresh in secure OS storage and sends refresh as `X-Refresh-Token`; body transport is forbidden. Mobile behavior does not change the endpoint or server rotation model.

## Account, RBAC & Errors / Account, RBAC và lỗi

Account must be active and verified. Guest is transient; registration assigns Customer. Database roles are Customer, Staff, Manager, Administrator; Super Admin is future-only. Effective permission is authoritative. `users:manage` controls account status; `sessions:manage` revokes others/all sessions; owner revokes current session.

Login/forgot/resend use enumeration-safe behavior. Password/token/cookie/authorization/reset/verification secrets are redacted. 401 means authentication/token failure; 403 is authenticated permission denial; public login collapses account-state failures into generic invalid credentials.

## Audit & Privacy / Audit và riêng tư

Audit register/login/rate/lock/session/refresh-reuse/revoke/password/verification/RBAC/account events with request/trace/user/session/result and minimized device context. Store keyed HMAC of normalized email/IP and coarse browser/platform only; no raw email in attempts, raw IP, full UA or raw token. Retention: sessions and attempts 90 days, terminal token records 30 days, security audit 365 days, subject to legal hold.

## Environment Settings / Cấu hình môi trường

All durations, Argon2 cost, CORS origins, cookie secure/same-site settings permitted by deployment policy, token issuer/audience/key references, rate ceilings and HMAC key references are validated environment settings. Defaults are documented, not hardcoded production secrets.

## Security References / Nguồn bảo mật

- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP CSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- RFC 9700 OAuth 2.0 Security Best Current Practice: https://www.rfc-editor.org/rfc/rfc9700.html
