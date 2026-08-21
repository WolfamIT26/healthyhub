# Payment Decisions — Prompt 27.1

- Prompt 32.1: only verified provider outcome may mutate VNPAY stock; browser return remains read-only.
- Paid consumes, failed/cancelled releases, and late failed→paid must reacquire stock atomically before confirming Order.

## Provider Decision

**APPROVED: VNPAY cho HealthyHub V1.** Quyết định này mở khóa foundation cấu hình, registry và dedupe persistence. Adapter/kết nối thật, ký request, xác minh IPN và tạo payment URL thuộc Prompt 27.2; chưa được triển khai tại đây.

## Prompt 27.2 Resolution

VNPAY Sandbox adapter hiện đã executable phía sau provider-neutral gateway. Backend tạo payment URL, ký request, verify return/IPN, query provider khi cần reconciliation và chỉ apply Order effect sau khi Payment success được xác minh. Browser return vẫn là UX-only, không phải nguồn đánh dấu `paid`.

## Provider decision matrix

Không ghi fee vì repository không có authoritative commercial agreement.

| Candidate | Vietnam/capabilities | Sandbox & hosted/redirect | Server authority | Refund/query | Integration note |
| --- | --- | --- | --- | --- | --- |
| VNPAY | Local gateway, VND, bank/QR ecosystem | Public sandbox, redirect payment URL | Return cho UX; IPN cho server update; checksum secret | QueryDr + refund | Conventional signed query parameters; merchant TmnCode/onboarding required |
| MoMo | Local wallet plus documented payment options | Test gateway, redirect/deeplink flows | IPN POST; signed payload | Query, full/partial refund; requestId idempotency documented | JSON/HMAC adapter; partner credentials/onboarding required |
| ZaloPay | Local wallet; docs also describe NAPAS VietQR/banks | Sandbox OpenAPI, create-order redirect/order URL | Merchant callback plus query API | Query + refund/query-refund | MAC adapter; app credentials/onboarding required |
| Stripe | Broad hosted Checkout/PaymentIntent ecosystem | Test mode and hosted/embedded Checkout | Webhook is required authority; return page is UX | Query/refund/webhook ecosystem | Vietnam merchant/payment-method eligibility must be verified before approval |

Official evidence: [VNPAY payment/IPN](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html), [VNPAY return vs IPN](https://sandbox.vnpayment.vn/apis/docs/faqs/), [MoMo IPN](https://developers.momo.vn/v3/docs/payment/api/result-handling/notification/), [MoMo idempotency](https://developers.momo.vn/v3/docs/payment/api/result-handling/idempotency/), [ZaloPay integration document](https://docs.zalopay.vn/downloads/api/ZaloPay-APIs-Integration-Document.pdf), [Stripe return/webhook guidance](https://docs.stripe.com/payments/checkout/custom-success-page).

## Canonical lifecycle resolution

Canonical application/API statuses follow shared data contract:

`unpaid → pending → paid | failed | cancelled`, `failed → paid | cancelled` for verified late success, `paid → partially_refunded | refunded`, `partially_refunded → refunded`.

- Same-state event is idempotent.
- `paid/refunded/cancelled` cannot regress.
- Provider `processing` is normalized to `pending`; `expired` is normalized to `cancelled` only by a future approved adapter.
- Physical `confirmed` is a legacy schema conflict and must map to canonical `paid` in a future migration before online persistence. It is not exposed as a new API status.
- COD remains `pending`, provider none/internal, no capture.

## Order mapping

| Payment status | Order effect |
| --- | --- |
| unpaid/pending/failed/cancelled/partially_refunded | None |
| paid | `confirm_if_placed`; never force transition from current physical `new` |
| refunded | Only through separately approved refund workflow |

Payment service returns a policy effect; it does not directly mutate arbitrary Order state.

## Authority and idempotency

- Browser return is navigation/status-query UX only.
- Verified webhook or provider query is authoritative.
- Create attempt uses one internal attempt/idempotency reference; retry reuses it.
- Webhook dedupe key is `(provider,eventId)`. Raw payload is not retained; only SHA-256 payload hash may be stored.
- Reference, amount and currency must equal authoritative Payment before transition.
- Browser Return URL chỉ phục vụ điều hướng/UX và không được cập nhật trạng thái thanh toán. IPN đã xác minh hoặc provider query mới là server authority.
- Event persistence dùng khóa duy nhất `(tenant_id, provider, provider_event_id)`, chỉ lưu SHA-256 payload hash, không lưu raw payload/signature.
- Prompt 32 không mở rộng provider-event business effect sang Inventory. Duplicate IPN protection cho Payment/Order không tự quyết định stock deduction/release timing.
