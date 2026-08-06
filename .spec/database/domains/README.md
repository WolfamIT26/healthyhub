# Domain Database Index / Danh sách Database theo Domain

## Purpose / Mục tiêu

Thư mục `domains` chứa Logical Database Design riêng cho từng domain của HealthyHub. Mỗi file chỉ mô tả dữ liệu logic của domain đó, không viết SQL và không tạo schema vật lý.

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

## Required Sections / Mục bắt buộc

Mỗi file domain phải có mục đích lưu trữ, entity list, PK, FK, quan hệ 1-1/1-N/N-N, cardinality, ràng buộc nghiệp vụ, chiến lược delete, audit fields, trạng thái dữ liệu, vòng đời dữ liệu, ownership, validation và data dictionary.
