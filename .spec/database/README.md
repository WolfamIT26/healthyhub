# Logical Database Design / Thiết kế Database Logical

## Purpose / Mục tiêu

Thư mục `.spec/database` chứa Logical Database Model cho HealthyHub. Bộ tài liệu này chuyển Domain Model thành thiết kế dữ liệu logic để làm đầu vào cho Physical Database Design và API Specification.

## Scope / Phạm vi

- Có mô tả entity, thuộc tính chính, PK, FK, quan hệ, cardinality, ràng buộc, vòng đời dữ liệu và data dictionary.
- Không viết SQL.
- Không tạo migration.
- Không tạo ORM model.
- Không tạo code.
- Không quyết định chi tiết physical schema như engine, column type cụ thể hoặc index thật.

## Reading Order / Thứ tự đọc

1. [Database Standards / Chuẩn database](database-standards.md)
2. [Domain Data Map / Bản đồ dữ liệu domain](domain-data-map.md)
3. [Cross Domain Relationships / Quan hệ dữ liệu liên domain](cross-domain-relationships.md)
4. [Logical ERD / ERD logic](logical-erd.md)
5. [Data Readiness / Chuẩn bị dữ liệu mở rộng](data-readiness.md)
6. [Domain Database Index / Danh sách database theo domain](domains/README.md)

## Domain Database Documents / Tài liệu database theo domain

| Group / Nhóm | Documents / Tài liệu |
| --- | --- |
| Identity & Access | [Authentication](domains/authentication.md), [User](domains/user.md), [Staff](domains/staff.md), [Settings](domains/settings.md) |
| Customer & Growth | [Customer](domains/customer.md), [Loyalty](domains/loyalty.md), [Coupon](domains/coupon.md), [Promotion](domains/promotion.md), [Review](domains/review.md) |
| Catalog | [Product](domains/product.md), [Category](domains/category.md), [Brand](domains/brand.md), [Media](domains/media.md), [Blog](domains/blog.md) |
| Commerce | [Inventory](domains/inventory.md), [Cart](domains/cart.md), [Wishlist](domains/wishlist.md), [Order](domains/order.md), [Payment](domains/payment.md), [Shipping](domains/shipping.md) |
| Intelligence & Operations | [AI](domains/ai.md), [Analytics](domains/analytics.md), [Notification](domains/notification.md) |

## Status Files / File trạng thái

- [Status](Status.md)
- [Report](Report.md)
- [Checklist](Checklist.md)
- [ChangeLog](ChangeLog.md)

## Usage Rule / Quy tắc sử dụng

Prompt Physical Database Design sau này phải đọc tài liệu này trước khi viết SQL hoặc migration. Nếu có thay đổi domain, phải cập nhật `.spec/domain` trước rồi mới cập nhật `.spec/database`.
