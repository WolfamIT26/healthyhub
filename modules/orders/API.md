# Order API / API module đơn hàng

## Endpoints / Endpoint

| Method | Path | Permission | Purpose / Mục đích |
| --- | --- | --- | --- |
| POST | `/api/v1/orders` | Verified Customer / Cart owner | Tạo Order từ Checkout. |
| GET | `/api/v1/me/orders` | Customer owner | Danh sách Order của Customer hiện tại. |
| GET | `/api/v1/me/orders/{orderId}` | Customer owner | Chi tiết Order persisted của Customer hiện tại. |

## List Query / Query danh sách

`page` mặc định 1, `pageSize` mặc định 20/tối đa 100; filter tùy chọn gồm `orderStatus`, `paymentStatus`, `shippingStatus`, `dateFrom`, `dateTo`. Sort cố định `createdAt` giảm dần với ID tie-breaker. Customer search không được bật.

## Security / Bảo mật

API không nhận `customerId`; owner derive từ JWT. Guest trả 401, internal trả 403, invalid/not-owned detail trả 404 đồng nhất. Detail không trả credential, checksum, signature, raw event hoặc internal audit actor.
