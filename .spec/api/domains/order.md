# Order API Specification / Đặc tả API đơn hàng

## API Overview / Tổng quan API

Order API quản lý checkout, tạo đơn, lịch sử đơn hàng của khách, xử lý trạng thái đơn hàng và timeline vận hành. Order giữ snapshot sản phẩm, khách hàng, địa chỉ và giá trị cần bảo toàn lịch sử.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/orders` | Tạo đơn hàng từ checkout | Guest token hoặc Customer JWT | Cart owner |
| GET | `/api/v1/me/orders` | Danh sách đơn của tôi | Customer JWT | Owner |
| GET | `/api/v1/me/orders/{orderId}` | Chi tiết đơn của tôi | Customer JWT | Owner |
| POST | `/api/v1/me/orders/{orderId}/cancel` | Khách hủy đơn nếu còn cho phép | Customer JWT | Owner |
| GET | `/api/v1/admin/orders` | Danh sách đơn admin | Staff JWT | `orders:read` |
| GET | `/api/v1/admin/orders/{orderId}` | Chi tiết đơn admin | Staff JWT | `orders:read` |
| PATCH | `/api/v1/admin/orders/{orderId}/status` | Đổi trạng thái đơn | Staff/Manager JWT | `orders:process` |
| POST | `/api/v1/admin/orders/{orderId}/cancel` | Admin hủy đơn | Staff/Manager JWT | `orders:process` |
| POST | `/api/v1/admin/orders/{orderId}/confirm` | Xác nhận đơn | Staff/Manager JWT | `orders:process` |
| GET | `/api/v1/admin/orders/{orderId}/timeline` | Timeline đơn hàng | Staff JWT | `orders:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `orders`.
- Action resources: `cancel`, `confirm`, `status`, `timeline`.

## HTTP Method / Phương thức HTTP

- POST tạo đơn và action nghiệp vụ.
- GET list/detail/timeline.
- PATCH đổi trạng thái.

## URI Convention / Quy ước URI

- Customer namespace: `/api/v1/me/orders`.
- Admin namespace: `/api/v1/admin/orders`.
- Checkout create dùng `/api/v1/orders`.
- ID parameter dùng `{orderId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Customer chỉ xem/hủy đơn của mình.
- Staff xử lý theo scope.
- Manager/Admin xử lý action nhạy cảm.

## Authentication / Xác thực

- Tạo order có thể dùng guest token hoặc Customer JWT.
- Customer history bắt buộc Customer JWT.
- Admin endpoint bắt buộc Staff JWT.

## Authorization / Phân quyền

- Owner check với `/me/orders`.
- Admin scope theo role/permission.
- Hủy/xác nhận/đổi trạng thái phải audit và cần reason khi phù hợp.

## Request Contract / Contract request

- Create order dùng checkout input, không nhận final total tự quyết từ client.
- Cancel/status action dùng action request, có reason và idempotency key.
- Admin list dùng pagination/filter/search/sort.

## Response Contract / Contract response

- Order summary/detail/timeline theo Data Contract.
- Detail trả item snapshot, payment summary, shipping summary, status và totals backend xác nhận.

## Error Contract / Contract lỗi

- `BUSINESS.ORDER.CANNOT_CANCEL`
- `BUSINESS.ORDER.INVALID_STATUS_TRANSITION`
- `CONFLICT.ORDER.ALREADY_PROCESSED`
- `BUSINESS.INVENTORY.INSUFFICIENT_STOCK`
- `BUSINESS.CART.COUPON_NOT_APPLICABLE`

## Validation Rule / Quy tắc validation

- Cart/checkout phải hợp lệ.
- Shipping information đủ dữ liệu.
- Order status transition hợp lệ.
- Reason bắt buộc với cancel/admin status nhạy cảm.

## Business Rule / Quy tắc nghiệp vụ

- Tạo đơn phải revalidate cart, price, stock, coupon và customer scope.
- Không cho hủy đơn đã giao/hoàn tất nếu rule không cho phép.
- Order giữ snapshot để bảo toàn lịch sử.

## Pagination / Phân trang

- Customer/admin order list default 20, max 100.

## Filter / Lọc

- Lọc theo orderStatus, paymentStatus, shippingStatus, createdAt, customerId admin only.

## Search / Tìm kiếm

- Admin search theo order code, customer summary, recipient phone masked.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Không áp dụng trực tiếp.

## Download / Download

Order invoice/export nếu có thuộc future enhancement, chưa tạo trong Prompt 10.

## Rate Limit / Giới hạn gọi API

- Create/cancel/status action: Strict.
- List/detail: Authenticated Normal.

## Idempotency / Chống gửi lặp

- Create order bắt buộc idempotency key.
- Cancel/status action nên có idempotency key.

## Webhook / Webhook

Order không nhận provider webhook trực tiếp; Payment/Shipping webhook cập nhật domain tương ứng và phát event cho Order.

## AI Endpoint / Endpoint AI

AI customer support hoặc analytics dùng order summary qua AI API theo permission scope.

