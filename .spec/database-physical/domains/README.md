# Domain Physical Database Index / Danh sách Database vật lý theo Domain

## Purpose / Mục tiêu

Thư mục này chứa Physical Database Design riêng cho từng domain của HealthyHub. Mỗi file mô tả table, column, data type MySQL, nullable, default, khóa, constraint, index và retention.

## Domain Files / File domain

- [Authentication](authentication.md)
- [User](user.md)
- [Customer](customer.md)
- [Staff](staff.md)
- [Product](product.md)
- [Category](category.md)
- [Brand](brand.md)
- [Inventory](inventory.md)
- [Cart](cart.md)
- [Wishlist](wishlist.md)
- [Order](order.md)
- [Payment](payment.md)
- [Shipping](shipping.md)
- [Coupon](coupon.md)
- [Promotion](promotion.md)
- [Loyalty](loyalty.md)
- [Review](review.md)
- [Blog](blog.md)
- [Media](media.md)
- [Notification](notification.md)
- [Analytics](analytics.md)
- [AI](ai.md)
- [Settings](settings.md)

## Common Rule / Quy tắc chung

Tất cả table tenant-scoped dùng `tenant_id BIGINT UNSIGNED NOT NULL`, audit columns chuẩn và soft delete nếu không ghi khác. Không tạo SQL trong thư mục này.
