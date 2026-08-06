# Authentication Flow V1 / Luồng xác thực API V1

## Common Controls / Kiểm soát chung

Validate JSON, normalize email, apply IP + identifier rate policy, redact secrets and emit security audit. Access tokens last 15 minutes. Web refresh is an HttpOnly secure cookie protected by signed double-submit CSRF and Origin/Referer validation; Mobile uses the refresh header from secure OS storage.

## Register & Verification / Đăng ký và xác minh

1. Guest submits full name, normalized email and a 12–128 character password.
2. Backend validates uniqueness, hashes with Argon2id and assigns Customer only.
3. Backend creates a single-use email verification token (24 hours), stores only its hash and sends notification.
4. Register returns user/verification summary, never tokens. Login remains unavailable until verified.
5. Verify consumes token atomically. Resend always returns an enumeration-safe accepted response and supersedes prior pending token as policy.

## Login / Đăng nhập

1. Validate Origin for browser traffic, format and Very Strict rate buckets.
2. Perform lookup and password verification without observable account-existence differences.
3. After 5 failed attempts for an identifier within 15 minutes, lock for 15 minutes; retain precise reason only in audit.
4. Require active, verified account. Create session and token family.
5. Return access token + actor/session data. Web sets refresh cookie; Mobile response may contain refresh token only when explicitly identified as mobile.

## Refresh & Reuse / Làm mới và phát hiện reuse

1. Web sends refresh cookie + `X-CSRF-Token`; Mobile sends `X-Refresh-Token`.
2. Backend validates client binding, CSRF/Origin when Web, token hash/generation, active session/account and expiry.
3. Atomically rotate token/hash and increment generation; return new access token and rotate client refresh token.
4. Presentation of an older/revoked generation marks family compromised, revokes session, audits reuse and returns generic re-login error.

## Logout & Revocation / Đăng xuất và thu hồi

Logout uses current Bearer identity, is idempotent, revokes current session and clears Web cookie. Password reset or account lock/disable revokes all account sessions. Password change revokes other sessions and rotates current. Administrator needs `sessions:manage` to revoke another user's/all sessions; account status needs `users:manage`.

## Forgot, Reset & Change Password / Khôi phục và đổi mật khẩu

Forgot always returns `{ accepted: true }` for valid email input. Eligible accounts receive a single-use 30-minute reset token whose hash only is stored. Reset atomically validates/consumes it, updates Argon2id hash, revokes all sessions and clears cookie. Change requires current password, applies the same password policy, revokes other sessions and rotates current. Invalid/expired/used reset token shares the same public error.

## Session & Authorization / Phiên và phân quyền

Session returns actor, persisted roles, effective permissions, `permissionsVersion` and safe token/session timestamps. Tokens do not embed the full permission list. Backend rechecks session/account state; sensitive authorization resolves current permissions. 401 triggers one coordinated client refresh; 403 keeps the session and shows forbidden state.

## Cleanup / Dọn dữ liệu

Scheduled idempotent batches purge revoked/expired sessions after 90 days, login attempts after 90 days, expired/terminal reset and verification records after 30 days, and security audit after 365 days unless legal hold. Deletion/anonymization removes identifier/IP/device linkage while preserving non-identifying aggregate security metrics.
