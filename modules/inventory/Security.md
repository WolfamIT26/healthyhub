# Inventory Security / Bảo mật Inventory

- Public Product response chỉ trả availability/sellable, không trả quantity, internal Inventory ID, supplier hay audit metadata.
- Cart/Order không nhận current stock, availability hoặc sellable authority từ client.
- Inventory lookup luôn tenant-scoped trong executable single-tenant boundary.
- Admin adjustment chưa mở nên không có endpoint thiếu authorization/idempotency bị expose.
- VNPAY browser return không phải payment hoặc stock authority; raw provider payload/credential không đi vào Inventory.
- Pessimistic locks, positive unsigned quantities và state invariants fail closed trước oversell/corrupt reservation.
- Provider-event dedupe và unique Order/Inventory reservation identity ngăn replay tạo stock effect lặp.
