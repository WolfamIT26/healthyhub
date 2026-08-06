# Shipping Domain / Domain giao hàng

## Purpose / Mục đích

Quản lý thông tin nhận hàng, trạng thái giao và rule giao hàng ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Đảm bảo order có thông tin giao đủ.
- Theo dõi shipping status.
- Xử lý lý do giao lỗi hoặc thay đổi địa chỉ theo quyền.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Shipment`
- Entity: `ShippingAddress`, `DeliveryAttempt`, `ShippingStatusHistory`
- Value Object: `RecipientInfo`, `ShippingFee`, `DeliveryNote`
- Enum: `ShippingStatus`, `DeliveryFailureReason`, `ShippingMethod`

## Relationships / Quan hệ với domain khác

- Shipping phụ thuộc Order và Customer.
- Notification gửi cập nhật giao hàng.
- Settings quyết định policy giao hàng.

## Business Rule / Quy tắc nghiệp vụ

- Địa chỉ nhận hàng phải đủ để giao.
- Phí giao hàng cần xác nhận trước khi đặt hàng.
- Thay đổi địa chỉ sau khi xử lý cần quyền và lý do.
- Trạng thái giao không được chuyển sai flow.

## Domain Event / Sự kiện domain

- `ShipmentCreated`
- `ShippingAddressChanged`
- `DeliveryStatusChanged`
- `DeliveryFailed`
- `DeliveryCompleted`

## Dependency / Phụ thuộc

- Core dependency: Order, Customer, Settings
- Supporting dependency: Notification

## Boundary / Ranh giới

Shipping không xử lý payment hoặc provider tracking chi tiết. Provider integration sẽ thuộc Gateway ở prompt sau.

