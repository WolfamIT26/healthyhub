# Inventory TODO / Việc cần làm Inventory

- [x] Prompt 32.1: approve và triển khai reservation/deduction/release lifecycle cho COD và VNPAY.
- [ ] Chốt exact adjustment request, permission và idempotency persistence contract.
- [x] Gọi release/restock từ internal Order cancellation/full-return transaction owner.
- [ ] Partial return và Payment provider refund settlement thuộc contract riêng; không suy diễn từ refund status.
- [ ] Nếu Payment có authoritative timeout transition/scheduler, nối transition đó với release; không dùng browser/clock Inventory độc lập.
- [ ] Admin Inventory API/UI thuộc prompt riêng; Prompt 32.1 không triển khai UI.
