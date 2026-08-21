# Inventory Database / Dữ liệu Inventory

## Executable Tables / Bảng đã chạy

`inventory_items` lưu `product_id`, `available_quantity`, `reserved_quantity`, `stock_threshold` và `stock_status` cùng audit/version fields.

`stock_reservations` lưu Order-scoped lifecycle `active → consumed|released` và `consumed → restocked`, cùng timestamps `reserved_at`, `consumed_at`, `released_at`, `reacquired_at`, `restocked_at`.

## Constraints / Ràng buộc

- Unique `(tenant_id, product_id)` ngăn duplicate authority.
- FK `product_id → products.id` với `ON DELETE RESTRICT` bảo vệ reference.
- Quantity dùng `INT UNSIGNED` và `chk_inventory_quantities` bảo vệ giá trị không âm.
- `chk_inventory_status` whitelist `available`, `low_stock`, `out_of_stock`, `disabled`.
- Unique `(tenant_id, order_id, inventory_item_id)` là canonical stock idempotency identity.
- FK reservation → Inventory/Order đều `RESTRICT`; quantity reservation là `INT UNSIGNED` và `> 0`.
- Index tenant/item/status và tenant/order/status phục vụ transition lookup/lock.

## Migration Decision / Quyết định migration

Prompt 32.1 thêm migration `1760000013000-enable-inventory-stock-lifecycle-v1` vì Order/VNPAY mutation cần durable lifecycle/idempotency state. Không tạo `stock_adjustments`: reservation row đủ cho business effect hiện tại, còn manual adjustment chưa có approved API/lifecycle.

Không có `expires_at`: VNPAY attempt expiry hiện chỉ giới hạn URL/attempt, chưa có authoritative Payment timeout transition. Reservation pending chỉ release từ terminal Payment event.
