# Prompt 18.3 — Authentication Password UX & Password Policy

## Outcome

Added accessible password visibility controls and a shared password-policy helper while preserving Authentication architecture, login behavior, token/session handling, routing, schema and OpenAPI.

## Password UX

- Shared `PasswordField` is used by Login, Register password/confirmation and Reset password/confirmation.
- Inputs default to `type="password"`; the native button toggles text/password without changing the controlled value.
- Toggle includes an inline SVG icon, dynamic Vietnamese `aria-label`, `aria-pressed`, keyboard support and focus preservation.
- No dependency or password logging was added.
- No Change Password frontend screen exists, so no new route/UI was introduced.

## Password policy

- Preserves approved 12–128 character and no-composition policy.
- Uses a deliberately small common-password deny-list.
- Rejects case-insensitive full email, local-part, full domain and meaningful domain labels derived from the actual account email.
- Does not hard-code email providers and does not generally ban `@`, `.`, or special characters.
- Frontend provides UX validation; backend authoritatively enforces Register, Reset and Change Password through the same helper.
- Reset validates against the account before consuming the one-time token. Login remains credential-only.

## Tests added

- Password hidden by default, show/hide twice, value/focus preservation and keyboard activation.
- Local-part, domain, full-email and case-insensitive rejection.
- Common-password rejection and acceptance of a strong unrelated password containing `@`.
- Register and Reset frontend behavior; Register, Reset and Change Password backend enforcement.

## Verification

- Frontend lint: pass.
- API lint: pass.
- Frontend/API/shared-utils typecheck: pass.
- Authentication frontend tests: 7 files / 24 tests pass using the repository-compatible installed Node 20 runtime.
- Authentication backend tests: 8 files / 30 tests pass.
- `npm run build:web`: pass.
- Full `npm run build`: pass.
- `git diff --check`: pass.
