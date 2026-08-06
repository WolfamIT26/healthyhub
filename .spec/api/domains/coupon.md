# Coupon API Specification / Đặc tả API mã giảm giá

## API Overview / Tổng quan API

Coupon API quản lý mã giảm giá, validate coupon cho cart/order, điều kiện áp dụng, usage limit và trạng thái coupon.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/coupons/validate` | Kiểm tra coupon cho cart/order | Guest token hoặc Customer JWT | Cart/order owner |
| GET | `/api/v1/admin/coupons` | Danh sách coupon admin | Manager/Admin JWT | `coupons:read` |
| POST | `/api/v1/admin/coupons` | Tạo coupon | Manager/Admin JWT | `coupons:manage` |
| GET | `/api/v1/admin/coupons/{couponId}` | Chi tiết coupon admin | Manager/Admin JWT | `coupons:read` |
| PATCH | `/api/v1/admin/coupons/{couponId}` | Cập nhật coupon | Manager/Admin JWT | `coupons:manage` |
| PATCH | `/api/v1/admin/coupons/{couponId}/status` | Pause/activate/archive coupon | Manager/Admin JWT | `coupons:manage` |
| GET | `/api/v1/admin/coupons/{couponId}/usage` | Xem usage coupon | Manager/Admin JWT | `coupons:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `coupons`.
- Action resources: `validate`, `status`, `usage`.

## HTTP Method / Phương thức HTTP

- POST cho validate/create.
- GET cho list/detail/usage.
- PATCH cho update/status.

## URI Convention / Quy ước URI

- Shared validate namespace: `/api/v1/coupons/validate`.
- Admin namespace: `/api/v1/admin/coupons`.
- ID parameter dùng `{couponId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Validate theo cart/order owner.
- Manager/Admin quản lý coupon.

## Authentication / Xác thực

- Validate cho guest/customer theo cart context.
- Admin endpoint bắt buộc Manager/Admin JWT.

## Authorization / Phân quyền

- Public/customer chỉ nhận kết quả hợp lệ/không hợp lệ, không thấy rule nội bộ chi tiết.
- Admin xem usage và condition theo quyền.

## Request Contract / Contract request

- Validate request có coupon code, cart/order context và actor scope.
- Create/update coupon dùng command input.
- Status action cần reason nếu archive/pause.

## Response Contract / Contract response

- Coupon validation result.
- Coupon summary/detail admin.
- Usage summary admin.

## Error Contract / Contract lỗi

- `BUSINESS.COUPON.EXPIRED`
- `BUSINESS.COUPON.USAGE_LIMIT_REACHED`
- `BUSINESS.COUPON.NOT_ELIGIBLE`
- `VALIDATION.COMMON.INVALID_INPUT`

## Validation Rule / Quy tắc validation

- Coupon code đúng format.
- Discount amount/rate hợp lệ.
- Period start/end hợp lệ.
- Condition không mâu thuẫn.

## Business Rule / Quy tắc nghiệp vụ

- Coupon hết hạn, paused hoặc archived không áp dụng.
- Usage limit kiểm tra theo tổng và theo customer nếu có.
- Coupon result phải được revalidate khi checkout.

## Pagination / Phân trang

- Admin coupon list default 20, max 100.
- Usage list có thể dùng pagination.

## Filter / Lọc

- Lọc theo couponStatus, discountType, startsAt, endsAt.

## Search / Tìm kiếm

- Search theo code và title.

## Sort / Sắp xếp

- Default sort: `updatedAt` desc.

## Upload / Upload

Không áp dụng.

## Download / Download

Export coupon usage nếu có dùng export contract.

## Rate Limit / Giới hạn gọi API

- Validate coupon: Strict.
- Admin CRUD: Authenticated Normal.

## Idempotency / Chống gửi lặp

- Validate coupon idempotent.
- Status action idempotent theo desired state.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI campaign assistant thuộc AI API, không tạo endpoint AI riêng trong Coupon API.

