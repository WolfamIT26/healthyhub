# Domain Overview / Tổng quan Domain

## Principle / Nguyên tắc

HealthyHub dùng domain model để giữ ranh giới nghiệp vụ rõ trước khi thiết kế database hoặc API. Mỗi domain có ownership riêng, business rule riêng và dependency rõ để phù hợp Modular Monolith và chuẩn bị khả năng tách service trong tương lai.

## Domain Types / Loại domain

| Type / Loại | Meaning / Ý nghĩa | Domains / Domain |
| --- | --- | --- |
| Core | Domain trọng tâm trực tiếp tạo giá trị bán hàng hoặc kiểm soát vận hành chính. | Product, Inventory, Cart, Order, Payment, Shipping, Customer, Authentication, User, Settings |
| Supporting | Domain hỗ trợ tăng trưởng, nội dung hoặc trải nghiệm. | Category, Brand, Media, Coupon, Promotion, Loyalty, Review, Blog, Notification, Staff |
| Shared | Domain dùng chung hoặc được nhiều domain tham chiếu. | Media, Settings, Notification |
| Cross-cutting | Domain xuyên hệ thống, tổng hợp hoặc hỗ trợ nhiều domain. | AI, Analytics |

## Aggregate Principle / Nguyên tắc aggregate

- Aggregate Root là đối tượng chịu trách nhiệm bảo vệ rule nhất quán trong một boundary.
- Entity chỉ sống trong domain nếu lifecycle của nó phụ thuộc domain đó.
- Value Object biểu diễn giá trị có ý nghĩa nghiệp vụ nhưng không cần danh tính riêng.
- Domain Event chỉ ghi nhận sự kiện nghiệp vụ quan trọng, chưa phải event kỹ thuật.

## Boundary Principle / Nguyên tắc boundary

- Domain không truy cập trực tiếp dữ liệu nội bộ của domain khác.
- Giao tiếp giữa domain dùng khái niệm nghiệp vụ rõ như Order Placed, Stock Reserved, Payment Confirmed.
- AI và Analytics chỉ đọc/tổng hợp/đề xuất, không sở hữu dữ liệu gốc.
- Payment, Shipping, Notification, AI, OCR, Vision là domain có thể đi qua Gateway khi triển khai.

