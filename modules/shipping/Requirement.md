# Shipping Requirement / Yêu cầu Shipping

- [x] Manual `0.00 VND` quote is server-authoritative and VN-address validated.
- [x] Shipment/address snapshot is persisted with Order.
- [x] Only approved internal Fulfillment authority changes status.
- [x] `shippedAt`/`deliveredAt` are persisted by valid monotonic transitions.
- [x] Delivery atomically completes Order; cancel/return atomically restore Inventory.
- [x] COD may fulfill while Payment pending; VNPAY requires verified paid/confirmed.
- [x] Duplicate/concurrent desired-state transitions are idempotent.

Provider tracking, delivery attempts, Admin UI/API and split shipment remain outside V1.

