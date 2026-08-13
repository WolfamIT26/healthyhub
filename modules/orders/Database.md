# Order Database / Dữ liệu module đơn hàng

## Tables / Bảng

Customer Orders V1 chỉ đọc các bảng hiện hữu: `orders`, `order_items`, `payments`, `shipments`, `shipping_addresses`.

## Authority / Nguồn dữ liệu

- `orders.customer_profile_id` là ownership boundary.
- OrderItem, ShippingAddress và giá trị tiền dùng snapshot đã persist.
- Canonical payment method/status lấy từ `payments`; shipping method/status lấy từ `shipments`.

## Indexes / Index

List dùng `idx_orders_customer_time` cho tenant/customer/time và stable ID tie-breaker. Filter status được giới hạn; không nhận tên cột/operator tùy ý.

Prompt 28 không thay schema và không tạo migration.
