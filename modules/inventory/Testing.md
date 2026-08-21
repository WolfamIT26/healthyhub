# Inventory Testing / Kiểm thử Inventory

## Automated Coverage / Bao phủ tự động

- Reader: available, low stock, insufficient, zero, out-of-stock, disabled, deleted, missing và invalid quantity.
- Migration contract: Product FK, unique Product authority, unsigned quantity và check constraint.
- Product: zero quantity → out-of-stock/sellable false; public response không có quantity.
- Cart: add/update vượt stock, Product unavailable/no longer sellable và unreadable persisted Product làm Cart invalid.
- Order: COD reserve/consume, transaction rollback sau reserve, concurrent Orders chỉ một đơn thắng khi stock thiếu, no-negative và restock retry.
- VNPAY: pending reservation, browser return no effect, paid consume, duplicate IPN no double effect, failed release và late-paid atomic reacquire.
- Persistence: migration FK/check/index/unique identity và absence của clock-based `expires_at`.

## Integration / Tích hợp

Order/VNPAY MySQL integration dùng InnoDB transaction và pessimistic locks thật. Product/Cart/Customer Order/Profile suites giữ regression cho read model, ownership và immutable snapshot khi Product/Inventory thật trở thành bắt buộc ở Order creation.
