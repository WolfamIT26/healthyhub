# Order Decisions — Prompt 26.1B

- Initial Order status: approved physical default `new`.
- Payment: `cod` hoặc `vnpay`, initial `pending`; không capture hoặc paid giả.
- Shipping: `manual`, fee authority `0.00 VND`; Shipment/address rows chỉ lưu immutable selection snapshot.
- Totals dùng decimal string và integer minor-unit arithmetic, không dùng floating point.
- Order number sinh server-side bằng ngày + 96-bit random suffix và unique DB constraint.
- Idempotency bổ sung tối thiểu hai SHA-256 hash columns trên `orders`; không lưu raw key.
- Cart không bị mutate sau create vì lifecycle transition chưa có approved rule.
- Prompt 27.1 mapping: verified `paid` may request `confirm_if_placed`. Other Payment statuses do not mutate Order; refund requires its own approved workflow.
- Prompt 27.2: verified VNPAY success may transition Order from `new` to `confirmed` through approved Payment service effect. COD remains `pending` and does not call provider.
- Prompt 27.3: browser return không apply effect; chỉ IPN verified được phép chuyển đúng `new → confirmed`. Payment service reload/lock persisted rows và không ép Order ngoài trạng thái nguồn đã approve.
