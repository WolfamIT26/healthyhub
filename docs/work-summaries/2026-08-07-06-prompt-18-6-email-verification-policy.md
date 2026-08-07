# Prompt 18.6 — Customer vs Internal Email Verification Policy

## Outcome

Customer email verification is now progressive: an unverified Customer can login, receive JWT/session, refresh and use the existing Customer area. Internal accounts remain verification-gated and receive `AUTH.EMAIL_NOT_VERIFIED` without session/JWT issuance.

## Backend policy

- Customer means exactly a Customer-only role set; any other/no role is Internal and denied by default when unverified.
- `ActorSummary.isEmailVerified` is returned in register/login/refresh/current session data.
- `EmailVerificationPolicyService` centralizes login/session and sensitive-action decisions.
- Forgot, Reset and Change Password require verified email.
- Reset rejects before consuming its one-time token when the account is unverified.
- Checkout, Payment, Change Email, Delete Account and Recovery do not exist in this repository; they must reuse this policy when introduced.
- JWT, refresh, CSRF, cookie, session architecture, schema, migration and OpenAPI were unchanged.

## Frontend UX

- Customer layout displays a sticky unverified-email banner.
- Banner supports Verify Now, Resend Verification and temporary dismissal; remount/reload shows it again.
- Development builds show local mail-provider guidance; production builds do not.
- Existing `/verify-email` is accessible while authenticated.
- Forgot Password shows explicit verification guidance and a resend link for `AUTH.EMAIL_NOT_VERIFIED`.

## Verification

- API lint: pass.
- Frontend lint: pass.
- Workspace typecheck: pass.
- API tests: 9 files / 40 tests pass.
- Frontend tests: 8 files / 27 tests pass.
- Integration command: exit 0, but 1 file / 3 tests skipped; not counted as pass.
- Full `npm run build`: pass.
- `git diff --check`: pass.
