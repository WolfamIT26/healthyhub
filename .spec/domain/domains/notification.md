# Notification Domain / Domain thông báo

## Purpose / Mục đích

Quản lý thông báo tài khoản, đơn hàng, chăm sóc khách và marketing ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Xác định loại, ưu tiên và điều kiện gửi notification.
- Tôn trọng opt-in/opt-out marketing.
- Chuẩn bị boundary cho Notification Gateway.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `NotificationRequest`
- Entity: `NotificationTemplate`, `NotificationRecipient`, `NotificationDeliveryStatus`
- Value Object: `NotificationContent`, `ChannelPreference`, `DeliveryContext`
- Enum: `NotificationType`, `NotificationChannel`, `DeliveryStatus`

## Relationships / Quan hệ với domain khác

- Authentication dùng Notification cho xác minh/reset.
- Order/Shipping dùng Notification cho cập nhật trạng thái.
- Promotion dùng Notification cho marketing campaign.
- Customer cung cấp contact/consent.

## Business Rule / Quy tắc nghiệp vụ

- Notification bảo mật và order được ưu tiên hơn marketing.
- Marketing notification phải tôn trọng opt-in.
- Nội dung phải rõ hành động cần làm.
- Lỗi gửi không được làm hỏng luồng mua hàng chính.

## Domain Event / Sự kiện domain

- `NotificationRequested`
- `NotificationSent`
- `NotificationFailed`
- `MarketingOptOutRespected`

## Dependency / Phụ thuộc

- Shared by: Authentication, Order, Shipping, Promotion, Customer
- Gateway dependency future: Notification Gateway

## Boundary / Ranh giới

Notification không quyết định order status hoặc campaign rule. Domain này chỉ quản lý thông báo và điều kiện gửi.

