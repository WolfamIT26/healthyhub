# Inventory Status / Trạng thái Inventory

## Current Status / Trạng thái hiện tại

- Inventory Persistence: **READY**.
- Inventory Authority: **READY**.
- Stock Mutation: **READY**.
- Order Stock Integration: **READY** cho executable COD/VNPAY flows.
- COD Stock Lifecycle: **READY**.
- VNPAY Stock Lifecycle: **READY**.

## Explicit Boundary / Ranh giới rõ ràng

Không còn blocker cho lifecycle đang executable. Prompt 33.1 có internal cancellation/full-return caller và idempotent release/restock. Public/admin cancellation API và Payment provider refund vẫn ngoài scope. VNPAY pending không tự expire cho tới khi Payment domain có terminal timeout authority.
