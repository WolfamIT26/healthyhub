# Loyalty API Specification / Đặc tả API điểm thưởng

## API Overview / Tổng quan API

Loyalty API quản lý điểm thưởng, tier member/VIP, lịch sử điểm và adjustment quản trị.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/me/loyalty/balance` | Xem số dư điểm của tôi | Member/VIP JWT | Owner |
| GET | `/api/v1/me/loyalty/transactions` | Lịch sử điểm của tôi | Member/VIP JWT | Owner |
| GET | `/api/v1/admin/loyalty/customers/{customerId}` | Xem loyalty customer | Staff/Manager JWT | `loyalty:read` |
| POST | `/api/v1/admin/loyalty/customers/{customerId}/adjustments` | Điều chỉnh điểm | Manager/Admin JWT | `loyalty:manage` |
| GET | `/api/v1/admin/loyalty/transactions` | Danh sách giao dịch điểm | Manager/Admin JWT | `loyalty:read` |
| GET | `/api/v1/admin/loyalty/tiers` | Danh sách tier | Manager/Admin JWT | `loyalty:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `loyalty`.
- Related resources: `balance`, `transactions`, `tiers`, `adjustments`.

## HTTP Method / Phương thức HTTP

- GET cho balance/transactions/tiers.
- POST cho adjustment.

## URI Convention / Quy ước URI

- Customer namespace: `/api/v1/me/loyalty`.
- Admin namespace: `/api/v1/admin/loyalty`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Owner xem điểm của mình.
- Manager/Admin quản lý adjustment.

## Authentication / Xác thực

- Bắt buộc Member/VIP JWT cho `/me`.
- Admin endpoint bắt buộc Staff JWT có quyền.

## Authorization / Phân quyền

- Customer chỉ xem loyalty của mình.
- Adjustment cần reason và audit.

## Request Contract / Contract request

- Transaction list dùng query input.
- Adjustment dùng action request với amount, type, reason và idempotency key.

## Response Contract / Contract response

- Point balance summary.
- Loyalty transaction summary.
- Tier summary.

## Error Contract / Contract lỗi

- `BUSINESS.LOYALTY.INSUFFICIENT_POINTS`
- `BUSINESS.LOYALTY.POINTS_EXPIRED`
- `PERMISSION.LOYALTY.OWNER_REQUIRED`
- `NOT_FOUND.CUSTOMER.CUSTOMER_NOT_FOUND`

## Validation Rule / Quy tắc validation

- Point amount là số nguyên hợp lệ.
- Adjustment type hợp lệ.
- Reason bắt buộc với adjustment.
- Customer phải tồn tại.

## Business Rule / Quy tắc nghiệp vụ

- Điểm pending/available/expired/reversed phải theo lifecycle.
- Không sửa transaction cũ, tạo adjustment bù.
- VIP tier do rule tính, client không tự set.

## Pagination / Phân trang

- Transaction list default 20, max 100.

## Filter / Lọc

- Lọc theo point status, transaction type, createdAt, customerId admin only.

## Search / Tìm kiếm

- Admin search theo customer summary.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Không áp dụng.

## Download / Download

Export loyalty transaction nếu có dùng export contract.

## Rate Limit / Giới hạn gọi API

- Read: Authenticated Normal.
- Adjustment: Strict.

## Idempotency / Chống gửi lặp

- Adjustment bắt buộc idempotency key.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI customer analysis có thể dùng loyalty aggregate qua AI/Analytics API theo quyền.

