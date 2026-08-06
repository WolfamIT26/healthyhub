# Decision / Quyết định Authentication V1

## Approved P0 Decisions / Quyết định P0 đã duyệt

All decisions were approved on 2026-08-06. Options are summarized, not reopened during implementation.

| ID / Problem | Options considered | Approved choice & reason | Impact / Files | Status |
| --- | --- | --- | --- | --- |
| PD-01 Password | Argon2id, scrypt, bcrypt | Argon2id, baseline 19 MiB/t=2/p=1; 12–128 Unicode chars, no composition, local common-password denylist. Memory-hard and usable. | KDF dependency/config later; Data Contract/API/OpenAPI/Security | Approved |
| PD-02 Token lifetime/claims | Long JWT, short JWT + refresh | JWT access 15m; refresh Prod 30d/Dev 7d; reset 30m; verify 24h; issuer/audience/sub/session/roles/permissionsVersion; values via env. Limits leakage while practical. | Environment examples/code later; API/Data Contract/Security | Approved |
| PD-03 Refresh storage/reuse | Plain DB, JWT refresh, opaque rotating | Opaque 256-bit token; DB SHA-256 hash only; session family/generation; rotate every use; old generation revokes compromised family. Strong replay detection without extra table. | Physical DB/API/OpenAPI | Approved |
| PD-04 Web cookie/CSRF/CORS | Browser storage, cookie only, cookie + CSRF | Access in memory; `__Host-hh_refresh` HttpOnly/Secure/SameSite=Lax/Path=/; signed double-submit header + Origin/Referer; credentialed exact-origin CORS. Protects XSS token theft and CSRF. | Data/API/UI/OpenAPI/Security | Approved |
| PD-05 Account protection | Rate only, permanent lock, temporary lock | 5 identifier failures/15m -> 15m temporary lock; combined IP+identifier limits, audited admin unlock. Reduces brute force without support-heavy permanent locks. | API/DB/Security/UI | Approved |
| PD-06 Unverified account | Full login, limited session, block | Block login/refresh until email verified; generic public error. No partial-permission complexity in V1. | API/UI/flows | Approved |
| PD-07 Responses/errors | Generic envelope, auth-specific data | Keep standard envelope with dedicated auth data schemas and canonical dotted codes/HTTP mapping. Removes client guessing. | Data Contract/API/OpenAPI | Approved |
| PD-08 Refresh transport | Body, header, cookie | Remove body. Web cookie+CSRF; future Mobile `X-Refresh-Token` from secure OS storage on same endpoint. Core API remains stable. | API/OpenAPI/UI | Approved |
| PD-09 Tenant/identifier | Tenant columns now, global V1, nullable prep | Single-tenant V1: no `tenant_id` in auth tables; globally unique normalized email; staged tenant migration later. Avoids speculative complexity. | Physical DB/Data/API | Approved |
| PD-10 Retention/privacy | Indefinite, immediate purge, bounded | Sessions/login attempts 90d; terminal reset/verify 30d; audit 365d; daily idempotent cleanup/legal hold; HMAC email/IP and coarse UA only. Balanced investigation/privacy. | Physical DB/API/Security | Approved |

## Additional Approved V1 Decisions / Quyết định V1 bổ sung

| ID | Approved decision | Impact | Status/date |
| --- | --- | --- | --- |
| PD-11 | Password reset revokes all sessions; password change revokes other sessions and rotates current; lock/disable revokes all | Session lifecycle | Approved / 2026-08-06 |
| PD-12 | Email-only login; phone optional profile only; Legal consent is not invented by Authentication | Request/UI schemas | Approved / 2026-08-06 |
| PD-13 | Logout is idempotent; auth rotation/one-time token actions do not require idempotency key; register key is optional | OpenAPI paths | Approved / 2026-08-06 |
| PD-14 | Guest not stored; persisted roles Customer/Staff/Manager/Administrator; Super Admin reserved, not seeded/assignable V1; authorization uses permissions | User/Auth boundary | Approved / 2026-08-06 |
| PD-15 | Token holds roles + `permissionsVersion`, not full permissions; sensitive action resolves current effective permissions | Immediate permission changes | Approved / 2026-08-06 |

## Future Enhancement / Tương lai

Multi-tenant SaaS, Super Admin platform scope, MFA, social login, SSO, device-session management UI and breached-password network integration are P1/Future, not V1 blockers.

## Decision Basis / Cơ sở

Choices follow project security rules and current OWASP password/session/CSRF guidance plus refresh-token rotation/reuse principles in RFC 9700. No production secret or code is included.
