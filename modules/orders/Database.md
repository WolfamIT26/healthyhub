# Order Database / Dữ liệu module đơn hàng

## Tables / Bảng

Runtime dùng `orders`, `order_items`, `payments`, `shipments`, `shipping_addresses`, `order_status_histories` và `shipping_status_histories`.

## Authority / Nguồn dữ liệu

- `orders.customer_profile_id` là ownership boundary.
- OrderItem, ShippingAddress và giá trị tiền dùng snapshot đã persist.
- Canonical payment method/status lấy từ `payments`; shipping method/status lấy từ `shipments`.

## Indexes / Index

List dùng `idx_orders_customer_time` cho tenant/customer/time và stable ID tie-breaker. Filter status được giới hạn; không nhận tên cột/operator tùy ý.

Migration `1760000014000-enable-order-fulfillment-review-eligibility` mở exact Order/Shipment status checks và tạo hai history table có tenant/status/time indexes, Order/Shipment `RESTRICT` FK và nullable actor `SET NULL` FK. Migration forward/reversible; `synchronize=false` giữ nguyên.

`orders.completed_at` và `shipments.shipped_at|delivered_at` được reuse, không tạo timestamp trùng. Delivery set `delivered_at` và `completed_at` cùng transaction. Cancel/return reason và thời điểm authoritative nằm trong history rows.
