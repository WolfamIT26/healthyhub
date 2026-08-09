# Order Decisions — Prompt 26.1B

- Initial Order status: approved physical default `new`.
- Payment: `cod`, initial `pending`; không capture hoặc paid giả.
- Shipping: `manual`, fee authority `0.00 VND`; Shipment/address rows chỉ lưu immutable selection snapshot.
- Totals dùng decimal string và integer minor-unit arithmetic, không dùng floating point.
- Order number sinh server-side bằng ngày + 96-bit random suffix và unique DB constraint.
- Idempotency bổ sung tối thiểu hai SHA-256 hash columns trên `orders`; không lưu raw key.
- Cart không bị mutate sau create vì lifecycle transition chưa có approved rule.
