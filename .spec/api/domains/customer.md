# Customer API Specification / Đặc tả API khách hàng

## API Overview / Tổng quan API

Customer API quản lý hồ sơ khách hàng, địa chỉ, phân khúc, lịch sử tương tác và dữ liệu chăm sóc khách hàng. Customer self API phục vụ người mua, Admin Customer API phục vụ staff/manager/admin.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/me/profile` | Xem hồ sơ của tôi | Customer JWT | Owner |
| PATCH | `/api/v1/me/profile` | Cập nhật hồ sơ của tôi | Customer JWT | Owner |
| GET | `/api/v1/me/addresses` | Danh sách địa chỉ | Customer JWT | Owner |
| POST | `/api/v1/me/addresses` | Thêm địa chỉ | Customer JWT | Owner |
| PATCH | `/api/v1/me/addresses/{addressId}` | Sửa địa chỉ | Customer JWT | Owner |
| DELETE | `/api/v1/me/addresses/{addressId}` | Xóa mềm địa chỉ | Customer JWT | Owner |
| GET | `/api/v1/admin/customers` | Danh sách khách hàng | Staff JWT | `customers:read` |
| GET | `/api/v1/admin/customers/{customerId}` | Chi tiết khách hàng | Staff JWT | `customers:read` |
| PATCH | `/api/v1/admin/customers/{customerId}` | Cập nhật thông tin quản trị | Manager/Admin JWT | `customers:manage` |
| PATCH | `/api/v1/admin/customers/{customerId}/segment` | Cập nhật phân khúc | Manager/Admin JWT | `customers:manage` |

## REST Resource / Tài nguyên REST

- Primary resources: `profile`, `addresses`, `customers`.
- Action resource: `segment`.

## HTTP Method / Phương thức HTTP

- GET cho đọc dữ liệu.
- POST cho tạo địa chỉ.
- PATCH cho cập nhật.
- DELETE cho xóa mềm địa chỉ.

## URI Convention / Quy ước URI

- Customer self namespace: `/api/v1/me`.
- Admin namespace: `/api/v1/admin/customers`.
- ID parameter dùng `{customerId}` hoặc `{addressId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Customer chỉ xem/sửa dữ liệu của chính mình.
- Staff xem customer theo scope vận hành.
- Manager/Admin có thể cập nhật segment và note quản trị.

## Authentication / Xác thực

- Customer self endpoint bắt buộc Customer JWT.
- Admin endpoint bắt buộc Staff JWT trở lên.

## Authorization / Phân quyền

- Owner check bắt buộc với `/me`.
- Admin scope kiểm tra theo role và permission.
- Email, phone, address có thể masking nếu actor không đủ quyền.

## Request Contract / Contract request

- Profile update chỉ nhận `fullName`, `phone`; bắt buộc `X-Idempotency-Key`. Email/customerId/role/consent/audit field bị từ chối.
- Address create/update dùng `recipientName`, `phone`, `countryCode=VN`, `provinceCity`, `district`, optional `ward`, `addressLine`, optional `note`, optional `isDefault`.
- Mutation Address bắt buộc `X-Idempotency-Key`; create dedupe theo owner/key/payload hash.
- Segment update cần action reason.

## Response Contract / Contract response

- Profile response chỉ trả `fullName`, read-only `email`, `phone`, `updatedAt`.
- Address response chỉ trả `addressId`, shipping fields an toàn, `isDefault`, `updatedAt`; không trả customerProfileId/audit/idempotency hash.
- Admin customer detail trả customer summary, segment, order summary và loyalty summary theo quyền.
- Không trả credential hoặc auth token.

## Error Contract / Contract lỗi

- `NOT_FOUND.CUSTOMER.CUSTOMER_NOT_FOUND`
- `BUSINESS.CUSTOMER.SEGMENT_NOT_ALLOWED`
- `PERMISSION.CUSTOMER.OWNER_REQUIRED`
- `NOT_FOUND.CUSTOMER.PROFILE_NOT_FOUND`
- `NOT_FOUND.CUSTOMER.ADDRESS_NOT_FOUND`
- `VALIDATION.CUSTOMER.INVALID_INPUT`
- `VALIDATION.CUSTOMER.IDEMPOTENCY_KEY_INVALID`
- `CONFLICT.CUSTOMER.IDEMPOTENCY_KEY_REUSED`

## Validation Rule / Quy tắc validation

- Email/phone đúng format nếu cho cập nhật.
- Address cần đủ tên người nhận, phone, địa chỉ và khu vực giao hàng.
- Segment value phải nằm trong enum hợp lệ.

## Business Rule / Quy tắc nghiệp vụ

- Customer tier/segment không tự quyết định từ client.
- Địa chỉ đã dùng trong order không được làm mất snapshot order cũ.
- Dữ liệu cá nhân phải tuân thủ data privacy.

## Pagination / Phân trang

- Admin customer list dùng page pagination default 20, max 100.
- Address list của owner thường không cần pagination nhưng vẫn có thể dùng nếu mở rộng.

## Filter / Lọc

- Admin list lọc theo `customerTier`, `customerStatus`, `createdAt`, `lastOrderAt`.

## Search / Tìm kiếm

- Admin search theo tên, email masked, phone masked.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.
- Cho phép sort theo `createdAt`, `lastOrderAt`, `customerTier`.

## Upload / Upload

Không áp dụng trực tiếp. Avatar/tài liệu nếu có đi qua Media API.

## Download / Download

Export customer data chỉ cho admin có quyền và theo privacy policy, chưa là MVP endpoint bắt buộc.

## Rate Limit / Giới hạn gọi API

- Customer self: Authenticated Normal.
- Admin segment update: Strict.

## Idempotency / Chống gửi lặp

- Address create được dedupe theo hash của key và payload; raw key không persist.
- Profile/address update là desired-state; Address delete idempotent.
- Segment update theo desired state nên idempotent.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI có thể dùng customer summary qua AI API nếu actor có quyền. Customer API không tạo AI endpoint riêng.
