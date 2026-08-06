# Domains Index / Danh sách Domain

## Purpose / Mục tiêu

Thư mục `domains` chứa Domain Model riêng cho từng domain của HealthyHub.

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

## Usage Rule / Quy tắc sử dụng

Khi thiết kế database/API sau này, chỉ mở domain liên quan và dependency trực tiếp của nó. Không đọc toàn bộ domain model nếu không cần.

