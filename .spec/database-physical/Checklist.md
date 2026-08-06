# Physical Database Checklist / Checklist Physical Database Design

## Scope Checklist / Checklist phạm vi

- [x] Đã đọc Foundation Documentation.
- [x] Đã đọc AI Development Core.
- [x] Đã đọc Business Blueprint.
- [x] Đã đọc Feature Specifications.
- [x] Đã đọc Domain Model.
- [x] Đã đọc Logical Database Design.
- [x] Chỉ tạo Physical Database Documentation.
- [x] Không viết SQL.
- [x] Không tạo migration file.
- [x] Không tạo ORM model.
- [x] Không tạo code.

## Global Design Checklist / Checklist thiết kế chung

- [x] Có Physical Database Index.
- [x] Có Physical Standards.
- [x] Có Relationship Rules.
- [x] Có Index Catalog.
- [x] Có Performance Strategy.
- [x] Có Migration Strategy.
- [x] Có Backup Recovery.
- [x] Có chuẩn BIGINT/INT.
- [x] Có chuẩn VARCHAR length.
- [x] Có chuẩn DECIMAL precision.
- [x] Có chuẩn DATETIME strategy.
- [x] Có chuẩn boolean strategy.
- [x] Có chuẩn enum strategy.
- [x] Có chuẩn JSON strategy.
- [x] Có chuẩn audit columns.
- [x] Có chuẩn FK delete rule.
- [x] Có chuẩn index/composite index/full text/generator.
- [x] Có chuẩn archive/retention.

## Domain Coverage Checklist / Checklist bao phủ domain

- [x] Authentication.
- [x] User.
- [x] Customer.
- [x] Staff.
- [x] Product.
- [x] Category.
- [x] Brand.
- [x] Inventory.
- [x] Cart.
- [x] Wishlist.
- [x] Order.
- [x] Payment.
- [x] Shipping.
- [x] Coupon.
- [x] Promotion.
- [x] Loyalty.
- [x] Review.
- [x] Blog.
- [x] Media.
- [x] Notification.
- [x] Analytics.
- [x] AI.
- [x] Settings.

## Per Domain Checklist / Checklist mỗi domain

- [x] Có table list.
- [x] Có table description.
- [x] Có column list.
- [x] Có MySQL data type.
- [x] Có nullable/default.
- [x] Có primary key.
- [x] Có foreign key.
- [x] Có unique constraint.
- [x] Có check constraint nếu phù hợp.
- [x] Có index.
- [x] Có composite index nếu phù hợp.
- [x] Có full text index nếu cần.
- [x] Có generated column nếu phù hợp.
- [x] Có FK delete rule.
- [x] Có performance note.
