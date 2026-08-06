# Order Domain / Domain đơn hàng

## Purpose / Mục đích

Quản lý vòng đời đơn hàng từ lúc khách xác nhận mua đến khi hoàn tất hoặc hủy.

## Responsibility / Trách nhiệm

- Tạo order từ cart hợp lệ.
- Quản lý trạng thái xử lý đơn.
- Điều phối với Inventory, Payment, Shipping và Notification ở mức nghiệp vụ.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Order`
- Entity: `OrderItem`, `OrderStatusHistory`, `OrderCancellation`
- Value Object: `OrderCode`, `OrderTotal`, `RecipientInfo`, `CancellationReason`
- Enum: `OrderStatus`, `OrderSource`, `CancellationType`

## Relationships / Quan hệ với domain khác

- Phụ thuộc Cart, Customer, Inventory, Payment, Shipping, Coupon/Promotion.
- Review và Loyalty thường phát sinh từ Order hợp lệ.
- Analytics đọc Order để tổng hợp kinh doanh.

## Business Rule / Quy tắc nghiệp vụ

- Order phải có khách, sản phẩm, thông tin nhận hàng và trạng thái.
- Order chỉ chuyển trạng thái theo flow hợp lệ.
- Hủy order phải ghi lý do.
- Staff chỉ xử lý order trong phạm vi quyền.

## Domain Event / Sự kiện domain

- `OrderPlaced`
- `OrderConfirmed`
- `OrderCancelled`
- `OrderCompleted`
- `OrderStatusChanged`

## Dependency / Phụ thuộc

- Core dependency: Cart, Customer, Inventory, Payment, Shipping
- Downstream: Notification, Loyalty, Review, Analytics, AI

## Boundary / Ranh giới

Order không tự xác thực thanh toán provider hoặc giao hàng provider. Payment và Shipping domain xử lý trạng thái chuyên biệt.

