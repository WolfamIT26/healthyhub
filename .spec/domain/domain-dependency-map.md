# Domain Dependency Map / Bản đồ phụ thuộc Domain

## Dependency Overview / Tổng quan phụ thuộc

```text
Authentication -> User
User -> Staff, Settings
Customer -> Authentication, User
Product -> Category, Brand, Media
Inventory -> Product
Cart -> Product, Inventory, Coupon
Wishlist -> Customer, Product
Order -> Cart, Customer, Inventory, Payment, Shipping, Coupon, Promotion
Payment -> Order
Shipping -> Order, Customer
Coupon -> Promotion, Customer, Product
Promotion -> Product, Coupon, Customer
Loyalty -> Customer, Order
Review -> Customer, Product, Order
Blog -> Media, Product
Notification -> Authentication, Order, Customer, Promotion
Analytics -> Order, Product, Inventory, Customer, Promotion, AI
AI -> Product, Customer, Order, Analytics, Media, Blog, Knowledge
Settings -> User, Notification, Payment, Shipping, AI
Staff -> User, Order, Inventory, Customer
Media -> Product, Brand, Blog, AI
Category -> Product
Brand -> Product
```

## Core Domain / Domain core

- Authentication
- User
- Customer
- Product
- Inventory
- Cart
- Order
- Payment
- Shipping
- Settings

## Shared Domain / Domain dùng chung

- Media
- Notification
- Settings
- User

## Cross-cutting Domain / Domain xuyên hệ thống

- AI
- Analytics

## Future Service Candidates / Domain có thể tách service tương lai

| Domain / Domain | Reason / Lý do có thể tách |
| --- | --- |
| Payment | Tích hợp provider, webhook, refund và security boundary riêng. |
| Shipping | Tích hợp đơn vị vận chuyển, tracking và SLA riêng. |
| Notification | Nhiều kênh gửi, retry, template và opt-in policy. |
| AI | Provider/model/prompt/context/logging/cost có lifecycle riêng. |
| Analytics | Query/tổng hợp dữ liệu có thể scale độc lập. |
| Media | Upload, storage, processing, OCR/Vision có hạ tầng riêng. |
| Inventory | Khi có multi-location hoặc dự báo tồn kho nâng cao. |

## Dependency Rule / Quy tắc phụ thuộc

- Dependency phải đi từ domain điều phối sang domain cung cấp dữ kiện nghiệp vụ.
- Domain core không phụ thuộc trực tiếp implementation của supporting domain.
- Cross-cutting domain chỉ dùng contract và event, không sửa aggregate của domain khác.

