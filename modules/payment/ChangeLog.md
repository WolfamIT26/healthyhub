# Payment ChangeLog

## 2026-08-21 — Prompt 32.1

- Added Inventory reservation transition to the provider-event business-effect transaction.
- Duplicate IPN cannot double stock effect; failed/cancelled release and late-paid reacquire are fail-closed.

## 2026-08-21 — Prompt 32

- Confirmed browser return remains read-only and IPN dedupe is not reused for stock mutation before an approved Inventory lifecycle/idempotency contract exists.

## 2026-08-12 — Prompt 27.3

- Fixed official query-string checksum encoding and VNPAY status mapping.
- Made browser return verification read-only; only IPN applies Payment/Order effects.
- Added terminal/reference/Order/Payment/attempt amount checks, matching-attempt resolution and locked transactional updates.
- Hardened provider-event duplicate/concurrency behavior, query timeout/error validation and alphanumeric provider references.
- Added signed-fixture unit/MySQL verification; real Sandbox E2E remains blocked by missing credentials/public IPN callback.

## 2026-08-10 — Prompt 27.2

- Added executable VNPAY Sandbox adapter behind the provider-neutral gateway.
- Added server-side payment URL generation, return/IPN verification, provider query and normalized status mapping.
- Added payment intent/status/method/IPN presentation boundary.
- Reused provider event dedupe persistence and kept COD unchanged.

## 2026-08-09 — Prompt 27.1

- Harmonized canonical lifecycle and safe late/duplicate event behavior.
- Added Order effect policy and provider-neutral webhook/dedupe contracts.
- Added Vietnam provider decision matrix; Provider Decision remains pending.
# Prompt 27.1A

- Approved VNPAY for V1 at the provider decision boundary.
- Added validated VNPAY configuration foundation without real credentials or provider calls.
- Added generic, transactional provider-event dedupe persistence and reversible migration.
- Kept COD and Checkout behavior unchanged.
