# Inventory Module / Module tồn kho

## Purpose / Mục tiêu

Inventory sở hữu số lượng khả dụng và trạng thái tồn kho dùng bởi Product, Wishlist, Cart và bước revalidation của Order. Frontend không quyết định quantity, availability hoặc sellable state.

## Executable Scope / Phạm vi đã chạy

- Persistence `inventory_items` một bản ghi active cho mỗi Product/tenant.
- `InventoryAvailabilityReader` trả trạng thái authoritative cho quantity nguyên dương.
- Product public chỉ trả availability/sellable, không trả quantity nội bộ.
- Cart add/update/read và Order create revalidate Product + Inventory phía server.
- Order create reserve stock bằng row lock trong cùng transaction; COD consume ngay, VNPAY giữ reservation pending.
- Verified VNPAY IPN consume khi paid và release khi failed/cancelled; browser return không mutate stock.
- `stock_reservations` ghi state/idempotency theo Order + Inventory item.

## Boundary / Ranh giới

Admin Inventory API/UI, manual adjustment, warehouse, supplier, purchase order và stock transfer chưa executable. Order cancellation/refund runtime cũng chưa tồn tại; internal restock transition đã có nhưng chỉ được gọi bởi future authoritative cancellation/refund transaction.
