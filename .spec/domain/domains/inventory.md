# Inventory Domain / Domain tồn kho

## Purpose / Mục đích

Quản lý khả năng bán của sản phẩm và cảnh báo tình trạng tồn kho ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Theo dõi trạng thái còn hàng/gần hết/hết hàng/tạm ngừng bán.
- Bảo vệ rule tránh bán sai khả năng phục vụ.
- Ghi nhận điều chỉnh tồn kho có lý do.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `InventoryItem`
- Entity: `StockAdjustment`, `StockAlert`, `StockReservation`
- Value Object: `AvailableQuantity`, `StockThreshold`, `AdjustmentReason`
- Enum: `StockStatus`, `AdjustmentType`, `ReservationStatus`

## Relationships / Quan hệ với domain khác

- Phụ thuộc Product.
- Cart và Order kiểm tra Inventory trước khi đặt hàng.
- Analytics và AI có thể đọc Inventory để tạo insight.

## Business Rule / Quy tắc nghiệp vụ

- Không cho khả năng bán âm ở mức nghiệp vụ.
- Sản phẩm gần hết cần cảnh báo.
- Hủy trước consume phải release; hủy/refund sau consume phải restock từ authoritative Order/refund transaction.
- Điều chỉnh bất thường cần lý do.

## Domain Event / Sự kiện domain

- `StockAdjusted`
- `LowStockDetected`
- `StockReserved`
- `StockReleased`
- `OutOfStockDetected`

## Dependency / Phụ thuộc

- Core dependency: Product, Order
- Downstream: Cart, Analytics, AI

## Boundary / Ranh giới

Inventory không quản lý kế toán kho chi tiết hoặc supplier purchasing. Domain này chỉ bảo vệ khả năng bán.

## Prompt 32.1 Decision / Quyết định Prompt 32.1

Executable V1 là read/validation và Order stock mutation authority. Quantity bằng 0 ưu tiên hơn status lưu và phải out-of-stock; Product active/sellable vẫn do Product boundary kết hợp với Inventory availability.

OrderPlaced reserve cho cả COD/VNPAY. COD consume ngay; verified VNPAY paid consume, failed/cancelled release. VNPAY pending không tự expire nếu Payment chưa có authoritative terminal timeout. Unique tenant/Order/Inventory identity và state transition bảo vệ retry; browser return không phải authority.
