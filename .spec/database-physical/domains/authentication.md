# Authentication Physical Database V1 / Database vật lý Authentication V1

## Metadata & Ownership / Thông tin và sở hữu

Version `1.1.0`, approved 2026-08-06. Authentication owns sessions, login attempts, password-reset and account-verification records. User owns account, normalized email, password credential, status, roles, permissions and join tables. Audit platform owns immutable security events. Staff owns staff profile only.

HealthyHub V1 is single-tenant: Authentication tables below MUST NOT contain `tenant_id`. User email is globally unique by normalized value. Future SaaS migration adds tenant ownership to User first, then nullable/backfilled/indexed Authentication tenant keys in an online staged migration; no speculative V1 tenant constraint.

## Common Columns / Cột chung

Every Authentication table uses `id BIGINT UNSIGNED NOT NULL` PK, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, nullable actor audit columns and `version INT UNSIGNED NOT NULL DEFAULT 1`. Token-bearing records never store plaintext tokens.

## Tables & Columns / Bảng và cột

### `authentication_sessions`

| Column | MySQL type | Null/default | Rule |
| --- | --- | --- | --- |
| `user_account_id` | `BIGINT UNSIGNED` | No | FK User |
| `session_public_id` | `CHAR(36)` | No | Opaque public session ID, unique |
| `session_status` | `VARCHAR(32)` | No / `active` | active, expired, revoked, compromised |
| `refresh_token_hash` | `CHAR(64)` | No | SHA-256 hex of opaque 256-bit token |
| `refresh_token_family_id` | `CHAR(36)` | No | Family/reuse correlation |
| `refresh_token_generation` | `INT UNSIGNED` | No / 1 | Increment atomically on rotation |
| `session_context` | `JSON` | Yes | Device label/platform/browser family only |
| `issued_at`, `last_used_at` | `DATETIME(3)` | No | Lifecycle |
| `expires_at` | `DATETIME(3)` | No | Refresh/session expiry |
| `revoked_at`, `compromised_at` | `DATETIME(3)` | Yes | Security terminal markers |
| `revoked_reason` | `VARCHAR(64)` | Yes | Safe enum/code, no secret |

Constraints/indexes: FK `user_account_id -> user_accounts.id` RESTRICT during retention; unique session public ID and refresh hash; check expiry > issued, generation > 0 and terminal timestamp/status consistency; indexes `(user_account_id, session_status)`, `(expires_at)`, `(refresh_token_family_id, session_status)`. Rotation locks the session row, compares current generation/hash in constant time and replaces it atomically. A token carries public session ID + generation + random secret; any non-current generation for a known family revokes it as compromised.

### `login_attempts`

| Column | MySQL type | Null/default | Rule |
| --- | --- | --- | --- |
| `user_account_id` | `BIGINT UNSIGNED` | Yes | Nullable FK |
| `identifier_hash` | `CHAR(64)` | No | Keyed HMAC of normalized email; no raw email |
| `attempt_status` | `VARCHAR(32)` | No / `failed` | success, failed, blocked |
| `failure_reason` | `VARCHAR(64)` | Yes | Internal safe enum |
| `ip_hash` | `CHAR(64)` | Yes | Keyed HMAC; no raw IP |
| `user_agent_family` | `VARCHAR(100)` | Yes | Coarse parsed family, no full UA |
| `attempted_at` | `DATETIME(3)` | No | Rate/audit time |

Constraints/indexes: nullable User FK, allowed status check; indexes `(identifier_hash, attempted_at)` and `(ip_hash, attempted_at)`. HMAC key comes from secret management and is rotatable; no raw identifier/IP is retained here.

### `password_reset_requests`

`user_account_id BIGINT UNSIGNED NOT NULL`, `request_status VARCHAR(32) DEFAULT requested`, unique `token_reference CHAR(64)` (SHA-256 only), `requested_at`, `expires_at DATETIME(3) NOT NULL`, `used_at DATETIME(3) NULL`. FK User; check expiry > requested; indexes user/status and expiry. Allowed status: requested, used, expired, cancelled.

### `account_verifications`

`user_account_id BIGINT UNSIGNED NOT NULL`, `verification_type VARCHAR(32) NOT NULL` (V1: email), `verification_status VARCHAR(32) DEFAULT pending`, unique `token_reference CHAR(64)` (SHA-256 only), `expires_at DATETIME(3) NOT NULL`, `verified_at DATETIME(3) NULL`. FK User; indexes user/type/status and expiry. Allowed status: pending, verified, expired, superseded.

## Retention, Delete & Privacy / Lưu giữ, xóa và riêng tư

| Data | Retention after terminal/expiry | Cleanup |
| --- | --- | --- |
| Revoked/expired/compromised sessions | 90 days | Daily idempotent batch hard-purges after FK/audit window |
| Login attempts | 90 days | Daily batch; aggregate non-identifying metrics may remain |
| Reset/verification records | 30 days | Purge expired/used/superseded records |
| Security audit events (external audit owner) | 365 days | Partition/batch purge unless legal hold |

Active records are never deleted. User deletion first revokes sessions and cancels tokens; after required retention, cleanup removes Authentication records or nulls actor audit references. No raw email/IP/full User-Agent/token survives in Authentication history. Legal hold overrides scheduled purge and is audited.
