# Order Testing — Prompt 26.1B

Unit coverage gồm verified/unverified/internal actor, ownership, empty Cart, Product/stock conflict, authoritative price, Shipping/Payment rejection, pending state, totals/snapshots, idempotency và immutable historical snapshot.

MySQL integration gồm persistence thật, retry same-key, Customer isolation và transaction rollback. Migration test kiểm tra forward schema, constraints/indexes và reverse-order rollback.

Prompt 27.2 bổ sung regression cho VNPAY Payment success/failure/duplicate callback để chứng minh Order effect chỉ apply một lần sau verified success. COD regression vẫn giữ Payment `pending`.

Prompt 27.3 chạy MySQL aggregate verification cho signed browser return, invalid signature, amount mismatch rollback, authoritative/duplicate IPN, Payment Result reload và kiểm tra trực tiếp Order/OrderItem/Payment/PaymentAttempt/Shipment/address/provider-event rows.

## Prompt 28 / Customer Orders V1

- API unit: empty list, pagination/filter mapping, COD/VNPAY canonical state, snapshot detail, safe Payment fields, invalid/not-owned 404, reversed date range, internal denial và controller guard metadata.
- MySQL integration: persisted list/detail, stable pagination, status/date filters, empty owner, Customer A/B isolation, COD pending và persisted VNPAY paid read state. Fixture paid chỉ kiểm tra read mapping, không đại diện hoặc fake VNPAY Sandbox E2E.
- Frontend: loading/empty/error/populated, filter/page URL state, retry, COD/VNPAY detail, direct route/reload, not-owned error, responsive CSS structure và Guest/Internal RouteGuard.
- Regression bắt buộc: Authentication, Checkout, Order creation, Payment/VNPAY và COD.
