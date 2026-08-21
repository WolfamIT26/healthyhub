# Inventory Status / Trạng thái Inventory

## Current Status / Trạng thái hiện tại

- Inventory Persistence: **READY**.
- Inventory Authority: **READY**.
- Stock Mutation: **READY**.
- Order Stock Integration: **READY** cho executable COD/VNPAY flows.
- COD Stock Lifecycle: **READY**.
- VNPAY Stock Lifecycle: **READY**.

## Explicit Boundary / Ranh giới rõ ràng

Không còn blocker cho lifecycle đang executable. Order cancellation/refund chưa có API/status transition nên chưa có runtime restock caller; internal idempotent restock primitive đã sẵn sàng cho future authoritative transaction. VNPAY pending không tự expire cho tới khi Payment domain có terminal timeout authority.
