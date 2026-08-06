# Database Mapping / Ánh xạ database Authentication V1

## Ownership / Sở hữu

User: account, normalized email/password credential/status, roles, permissions and joins. Authentication: four tables below. Audit platform: immutable security events. Staff: staff profile only. No duplicate credential/RBAC/session table.

## V1 Tables / Bảng V1

| Table | Key Authentication columns | Constraints/indexes | Retention |
| --- | --- | --- | --- |
| `authentication_sessions` | User FK; public ID; status; current refresh SHA-256 hash; family UUID; generation; minimized context; issued/last-used/expiry/revoked/compromised/reason | unique public ID/hash; expiry/generation/status checks; user/status, expiry, family/status indexes | 90d after terminal |
| `login_attempts` | nullable User FK; keyed identifier/IP HMAC; status/reason; coarse UA family; attempted time | allowed status; identifier/time and IP/time indexes | 90d |
| `password_reset_requests` | User FK; status; unique SHA-256 token reference; requested/expiry/used | expiry and lifecycle checks; user/status + expiry indexes | 30d after terminal |
| `account_verifications` | User FK; email type/status; unique SHA-256 token reference; expiry/verified | type/status/lifecycle checks; user/type/status + expiry indexes | 30d after terminal |

Common audit columns remain, but Authentication V1 tables do not have `tenant_id`. Email is globally unique after trim/lowercase normalization in single-tenant User storage. SaaS migration adds User tenant ownership first, then staged nullable/backfill/indexed Authentication keys.

Rotation row-locks session and atomically compares generation/hash before replace. Old generation marks family compromised. User deletion revokes/cancels active records, then bounded cleanup removes linkage; audit is retained 365 days by its owner unless legal hold.

The authoritative column/type/check/index definition is `.spec/database-physical/domains/authentication.md`. Database mapping has no remaining V1 conflict.
