# Payment API Specification / Đặc tả API thanh toán

## API Overview / Tổng quan API

Payment API quản lý payment intent, trạng thái thanh toán, refund và webhook provider tương lai. Domain này không lưu hoặc trả card data, provider secret hoặc thông tin nhạy cảm ngoài contract.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/payments/methods` | Lấy danh sách phương thức thanh toán khả dụng | Public | Public |
| POST | `/api/v1/payments/intents` | Tạo payment intent cho order | Customer JWT hoặc guest checkout token | Order payer |
| GET | `/api/v1/payments/vnpay/return` | Xác minh browser return từ VNPAY | Customer JWT | Order payer |
| GET | `/api/v1/payments/{paymentId}` | Xem trạng thái payment | Customer JWT hoặc Staff JWT | Owner hoặc `payments:read` |
| POST | `/api/v1/payments/{paymentId}/confirm` | Xác nhận payment nếu flow cần | Customer JWT | Order payer |
| GET | `/api/v1/admin/payments` | Danh sách payment admin | Staff JWT | `payments:read` |
| GET | `/api/v1/admin/payments/{paymentId}` | Chi tiết payment admin | Staff JWT | `payments:read` |
| POST | `/api/v1/admin/payments/{paymentId}/refunds` | Tạo refund | Manager/Admin JWT | `payments:refund` |
| GET | `/api/v1/admin/payments/{paymentId}/transactions` | Lịch sử transaction | Staff JWT | `payments:read` |
| GET | `/api/v1/webhooks/payment/vnpay` | Nhận IPN/callback từ VNPAY | Provider signature trong query string | Provider scope |

## REST Resource / Tài nguyên REST

- Primary resources: `payments`, `refunds`, `transactions`.
- Webhook resource: `webhooks/payment/vnpay`.

## HTTP Method / Phương thức HTTP

- POST cho intent, confirm và refund.
- GET cho methods, status/list/detail/transactions, VNPAY return và VNPAY IPN/callback theo provider contract.

## URI Convention / Quy ước URI

- Customer/payment namespace: `/api/v1/payments`.
- Admin namespace: `/api/v1/admin/payments`.
- Webhook namespace: `/api/v1/webhooks/payment/vnpay`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Payer xem payment của order mình.
- Staff đọc payment theo scope.
- Manager/Admin refund.
- Provider webhook chỉ qua provider authentication.

## Authentication / Xác thực

- Customer/guest checkout token cho payment action.
- Staff JWT cho admin.
- Provider signature trong query string cho VNPAY IPN/callback.

## Authorization / Phân quyền

- Không refund nếu actor không có `payments:refund`.
- Không trả provider secret, raw card data hoặc gateway internal payload.
- Webhook phải verify provider trước khi update payment.

## Request Contract / Contract request

- Payment intent request có orderId, payment method và idempotency key.
- Payment methods request không có body.
- VNPAY return/IPN nhận signed provider query parameters `vnp_TmnCode`, `vnp_Amount`, `vnp_ResponseCode`, `vnp_TransactionStatus`, `vnp_TransactionNo`, `vnp_TxnRef`, `vnp_SecureHash`; frontend không tạo hoặc quyết định các giá trị này.
- Refund request có amount, reason và idempotency key.
- Webhook request dùng provider event contract trung lập, không lộ vào public response.

## Response Contract / Contract response

- Payment summary/status.
- Refund summary.
- Transaction summary cho admin.
- Provider reference chỉ ở dạng an toàn.

## Error Contract / Contract lỗi

- `BUSINESS.PAYMENT.INVALID_STATUS`
- `INTEGRATION.PAYMENT.PROVIDER_ERROR`
- `CONFLICT.PAYMENT.IDEMPOTENCY_CONFLICT`
- `PERMISSION.COMMON.FORBIDDEN`

## Validation Rule / Quy tắc validation

- OrderId/paymentId hợp lệ.
- Amount là DecimalString và không vượt số có thể thanh toán/refund.
- Payment method thuộc danh sách được bật.
- Refund reason bắt buộc.

## Business Rule / Quy tắc nghiệp vụ

- Không thanh toán order đã hủy/hoàn tất sai trạng thái.
- Không refund vượt amount đã paid.
- Webhook trùng phải idempotent.
- Browser Return chỉ verify/hiển thị persisted state và không cập nhật Payment/Order/provider event.
- IPN verified là authoritative callback cập nhật Payment/Order; checksum, terminal, reference, Order/Payment/attempt amount và VND phải khớp trước business effect.

## Pagination / Phân trang

- Admin payment list default 20, max 100.
- Transactions có thể dùng cursor nếu lớn.

## Filter / Lọc

- Lọc theo paymentStatus, method, provider, createdAt, orderId.

## Search / Tìm kiếm

- Admin search theo order code, payment reference an toàn.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Không áp dụng.

## Download / Download

Export payment report nếu có dùng export contract và quyền `payments:read`.

## Rate Limit / Giới hạn gọi API

- Payment intent/confirm/refund: Strict.
- Webhook: Provider Strict.

## Idempotency / Chống gửi lặp

- Payment intent và refund bắt buộc idempotency key.
- Webhook phải dedupe bằng provider event ID.

## Webhook / Webhook

- URI pattern: `/api/v1/webhooks/payment/vnpay`.
- Webhook update payment status và phát event cho Order nếu hợp lệ.

## AI Endpoint / Endpoint AI

Không áp dụng. AI không được xử lý hoặc xem provider payment secret.
