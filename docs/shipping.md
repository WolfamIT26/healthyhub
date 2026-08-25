# HealthyHub Shipping Authority V1

## Status

**READY for Checkout quote and internal Order fulfillment consumption.**

Shipping V1 dùng rule nội bộ tối thiểu theo approved physical defaults:

- method: `manual`;
- method name: Giao hàng tiêu chuẩn HealthyHub;
- fee: `0.00 VND`, chỉ do server trả;
- serviceability: địa chỉ Việt Nam (`countryCode = VN`) có recipient, phone, province/city, district và address line hợp lệ;
- ward/note optional;
- ETA: `null`, vì chưa có provider/source authoritative.

Quote stateless, deterministic và gắn normalized address + Cart ID/subtotal/item count/validity. Checkout phải quote/revalidate lại trước Order creation. Client không gửi shipping fee hoặc total.

## Executable Fulfillment / Fulfillment đã chạy

- Shipment được tạo atomically cùng Order ở `pending` và giữ address snapshot.
- Canonical states là `pending → shipped → delivered → returned`, hoặc `pending → cancelled`.
- `shippedAt` chỉ set khi internal Fulfillment service nhận transition hợp lệ; `deliveredAt` chỉ set khi `shipped → delivered` và Order đồng thời chuyển `new|confirmed → completed`.
- Cancel/return yêu cầu reason. Mọi transition ghi `shipping_status_histories`; timestamps không được đi lùi.
- Order và Shipment rows dùng pessimistic lock trong một transaction, nên concurrent duplicate transition chỉ ghi effect/history một lần.
- COD có thể fulfillment khi Payment còn `pending`; VNPAY chỉ được fulfillment sau verified `paid`/Order `confirmed`. Payment paid không đồng nghĩa delivered.

Hiện không có shipping provider call, tracking runtime, delivery attempts, public/admin transition endpoint hoặc Shipping Admin UI. Fulfillment service là application boundary nội bộ dành cho actor vận hành tương lai; frontend không được tự set status.
