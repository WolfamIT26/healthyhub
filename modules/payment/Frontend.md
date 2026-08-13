# Payment Frontend Contract

Canonical UI states: `idle`, `creating`, `redirect_required`, `pending`, `paid`, `failed`, `cancelled`. Frontend never sets status itself. Redirect return triggers backend verification/status query and keeps pending UX while IPN/provider reconciliation is delayed.

Prompt 27.2 frontend behavior:

- Checkout renders payment methods from `GET /payments/methods`, currently COD + VNPAY.
- Selecting VNPAY creates Order first, then calls backend payment intent and redirects to the returned VNPAY Sandbox URL.
- `/payment/vnpay/return` calls backend return handler and navigates to result.
- `/payment/vnpay/result` reload/direct-access safe; it queries backend Payment state by `paymentId`.
- UI never displays `paid` from browser query params alone.
- Prompt 28 Customer Order list/detail hiển thị Payment status do backend trả từ persistence; Payment Result link tới `/orders/:orderId` nhưng không truyền status qua React memory.

# Prompt 27.1A

No frontend behavior changed. A future VNPAY return screen may display/query status but must never declare or persist payment success from browser parameters.
