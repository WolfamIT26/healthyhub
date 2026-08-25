# Order Module / Module đơn hàng

## Purpose / Mục tiêu

Order sở hữu vòng đời đơn và các snapshot bất biến phục vụ checkout, lịch sử Customer và phối hợp Payment/Shipping.

## Executable Scope / Phạm vi đã chạy

- Tạo Order từ Checkout qua `POST /api/v1/orders`.
- Customer đọc danh sách/chi tiết Order của chính mình qua `/api/v1/me/orders`.
- Payment đã verify có thể áp dụng mapping Order giới hạn; Order không tự verify provider.
- Internal `OrderFulfillmentService` thực thi shipped/delivered/cancelled/returned atomically với Shipment, status history và Inventory restore effect.

## Canonical states / Trạng thái chuẩn

- Order: `new`, `confirmed`, `completed`, `cancelled`, `returned`.
- Shipment: `pending`, `shipped`, `delivered`, `cancelled`, `returned`.
- Payment authority sở hữu VNPAY `new → confirmed`; Fulfillment authority sở hữu delivery/completion/cancel/return. Frontend không được set status.

## Dependencies / Phụ thuộc

Authentication, Customer owner mapping, Cart, Product, Inventory, Payment và Shipping.
