# Order Testing — Prompt 26.1B

Unit coverage gồm verified/unverified/internal actor, ownership, empty Cart, Product/stock conflict, authoritative price, Shipping/Payment rejection, pending state, totals/snapshots, idempotency và immutable historical snapshot.

MySQL integration gồm persistence thật, retry same-key, Customer isolation và transaction rollback. Migration test kiểm tra forward schema, constraints/indexes và reverse-order rollback.

Prompt 27.2 bổ sung regression cho VNPAY Payment success/failure/duplicate callback để chứng minh Order effect chỉ apply một lần sau verified success. COD regression vẫn giữ Payment `pending`.

Prompt 27.3 chạy MySQL aggregate verification cho signed browser return, invalid signature, amount mismatch rollback, authoritative/duplicate IPN, Payment Result reload và kiểm tra trực tiếp Order/OrderItem/Payment/PaymentAttempt/Shipment/address/provider-event rows.
