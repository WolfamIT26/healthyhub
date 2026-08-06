# Business Modules / Quản lý module nghiệp vụ

## Purpose / Mục tiêu

Thư mục này quản lý module nghiệp vụ độc lập với source code. Source code sau này nằm trong `apps`, còn tài liệu/định nghĩa nghiệp vụ cấp module có thể tham chiếu từ đây.

## Modules / Danh sách module

- [`authentication`](authentication/README.md): Context Pack xác thực V1 (đã mapping, còn blocker trước triển khai).
- `users`: người dùng.
- `products`: sản phẩm.
- `categories`: danh mục.
- `cart`: giỏ hàng.
- `orders`: đơn hàng.
- `payment`: thanh toán.
- `inventory`: tồn kho.
- `reviews`: đánh giá.
- `nutrition`: dinh dưỡng.
- `ai`: AI platform.
- `marketing`: marketing.

## Mapping / Ánh xạ

Template tài liệu đầy đủ cho mỗi module nằm tại `docs/modules/_template` và `.ai/templates/module`.
