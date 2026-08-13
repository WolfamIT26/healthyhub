# Order Module / Module đơn hàng

## Purpose / Mục tiêu

Order sở hữu vòng đời đơn và các snapshot bất biến phục vụ checkout, lịch sử Customer và phối hợp Payment/Shipping.

## Executable Scope / Phạm vi đã chạy

- Tạo Order từ Checkout qua `POST /api/v1/orders`.
- Customer đọc danh sách/chi tiết Order của chính mình qua `/api/v1/me/orders`.
- Payment đã verify có thể áp dụng mapping Order giới hạn; Order không tự verify provider.

## Dependencies / Phụ thuộc

Authentication, Customer owner mapping, Cart, Product, Inventory, Payment và Shipping.
