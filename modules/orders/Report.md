# Order Creation Boundary Report — Prompt 26.1B

## Status

**READY — executable Order creation boundary.**

`POST /api/v1/orders` tạo Order thật cho verified Customer từ active Cart. Server resolve owner, revalidate Product/Inventory, tạo lại Shipping quote, kiểm tra payment method backend-approved và tính totals; client không gửi owner, price, fee, status hoặc totals.

## Persistence

- `orders`, `order_items`, `payments`, `shipments`, `shipping_addresses` dùng approved physical split.
- OrderItem, address, shipping/payment selection và totals được ghi atomically; lỗi giữa transaction rollback toàn bộ.
- COD và VNPAY luôn bắt đầu `pending`; Shipment chỉ là selection/address snapshot `pending`, không phải fulfillment.
- Idempotency lưu SHA-256 của key và request, có unique owner/key constraint. Retry cùng payload trả Order cũ; payload khác trả conflict. Raw key không được lưu.
- Cart vẫn `active`: authoritative contract chưa quy định converted/closed transition. Prompt 26.2 phải quyết định lifecycle, không được tự xóa Cart.
- Chỉ revalidate Inventory; không reserve/deduct/mutate stock.

## Specification note

Physical Order design quy định initial/default `order_status = new`, trong khi shared enum contract liệt kê lifecycle từ `draft/placed` và không có `new`. Boundary này bám physical schema cho initial state và ghi rõ mismatch; không tự sửa authoritative specifications. Cần harmonize enum contract trước khi triển khai status transition.

Prompt 27.2 đã mở khóa approved Payment→Order transition cho VNPAY: chỉ verified success từ IPN/query đã xác minh mới được chuyển Order sang `confirmed`. COD Payment vẫn `pending`.

## Verification evidence

MySQL integration đã chứng minh Order/OrderItem/Payment/Shipment/address rows, owner isolation, same-key chỉ một Order và rollback không để lại header. OpenAPI Order request/response đã typed và Customer JWT-only.

## Prompt 27.2 note

Order không gọi VNPAY trực tiếp. Payment service chịu trách nhiệm verify provider, dedupe event, validate amount/reference và apply effect đã được approve.

## Prompt 27.3 Verification / Kiểm tra Prompt 27.3

MySQL flow xác nhận VNPAY amount lấy từ `orders.order_total` và phải khớp Payment/attempt. Browser return giữ Order `new/pending`; valid IPN mới chuyển `new → confirmed` và snapshot `paid` trong transaction có row locks. Duplicate IPN không double effect. OrderItem, Shipment và address snapshot không đổi. COD Order vẫn `new/pending` và không có provider attempt.
