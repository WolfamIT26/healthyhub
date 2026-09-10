# Business Modules / Quản lý module nghiệp vụ

## Purpose / Mục tiêu

Thư mục này quản lý module nghiệp vụ độc lập với source code. Source code sau này nằm trong `apps`, còn tài liệu/định nghĩa nghiệp vụ cấp module có thể tham chiếu từ đây.

## Modules / Danh sách module

- [`admin`](admin/README.md): Internal access control, application shell, authoritative Dashboard và Product management V1.
- [`authentication`](authentication/README.md): Context Pack xác thực V1 (đã mapping, còn blocker trước triển khai).
- `users`: người dùng.
- [`products`](products/README.md): public catalog authority và Admin Product management V1.
- [`categories`](categories/README.md): public Category authority và Product-scoped Admin assignment.
- `cart`: giỏ hàng.
- [`orders`](orders/README.md): Order create/read và canonical internal fulfillment lifecycle.
- [`payment`](payment/Report.md): COD/VNPAY authority và provider-event transaction.
- [`inventory`](inventory/README.md): quantity/reservation authority và Order stock lifecycle.
- [`shipping`](shipping/README.md): manual quote, persisted Shipment và internal fulfillment lifecycle.
- [`reviews`](reviews/README.md): public/customer Review persistence/API/Product Detail READY; Admin moderation blocked.
- `nutrition`: dinh dưỡng.
- `ai`: AI platform.
- `marketing`: marketing.

## Mapping / Ánh xạ

Template tài liệu đầy đủ cho mỗi module nằm tại `docs/modules/_template` và `.ai/templates/module`.
