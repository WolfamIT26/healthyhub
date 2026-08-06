# Physical Database Design / Thiết kế Database Vật lý

## Purpose / Mục tiêu

Thư mục `.spec/database-physical` chứa Physical Database Design cho HealthyHub dựa trên Logical Database Design. Bộ tài liệu này sẵn sàng làm đầu vào cho prompt sinh migration, ORM model và API specification ở các bước sau.

## Scope / Phạm vi

- Có table list, column list, MySQL data type, nullable, default value, PK, FK, unique constraint, check constraint, index, composite index, full text index và generated column nếu phù hợp.
- Có chuẩn BIGINT/INT, VARCHAR length, DECIMAL precision, DATETIME, boolean, enum, JSON và UUID.
- Có audit column, foreign key rule, performance, partition/archive, retention, migration strategy và backup/recovery.
- Không viết SQL.
- Không tạo migration file.
- Không tạo ORM model.
- Không tạo backend/frontend/API/code nghiệp vụ.

## Reading Order / Thứ tự đọc

1. [Physical Standards / Chuẩn database vật lý](physical-standards.md)
2. [Relationship Rules / Quy tắc quan hệ vật lý](relationship-rules.md)
3. [Index Catalog / Danh mục index vật lý](index-catalog.md)
4. [Performance Strategy / Chiến lược hiệu năng database](performance-strategy.md)
5. [Migration Strategy / Chiến lược migration](migration-strategy.md)
6. [Backup Recovery / Sao lưu và khôi phục](backup-recovery.md)
7. [Domain Physical Database Index / Database vật lý theo domain](domains/README.md)

## Domain Physical Database Documents / Tài liệu database vật lý theo domain

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

## Boundary Rule / Quy tắc ranh giới

Tài liệu này chỉ là physical design. Prompt tạo migration sau này mới được sinh SQL hoặc migration file dựa trên tài liệu này.
