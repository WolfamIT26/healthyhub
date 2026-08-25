# Review API Specification / Đặc tả API đánh giá

## API Overview / Tổng quan API

Review API quản lý đánh giá sản phẩm, rating summary, review của customer và moderation bởi staff/manager/admin.

## Prompt 33.2 runtime status / Trạng thái runtime Prompt 33.2

**READY — public/customer subset.** Sáu endpoint public và `/me` có controller/service/DTO/repository executable cùng typed OpenAPI. Hai Admin moderation endpoint vẫn design-only và có blocker `ADMIN_REVIEW_MODERATION_NOT_IMPLEMENTED`.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/products/{productId}/reviews` | Danh sách review public của sản phẩm | Public | Public |
| GET | `/api/v1/public/products/{productId}/reviews/summary` | Rating summary | Public | Public |
| GET | `/api/v1/me/reviews` | Review của tôi | Customer JWT | Owner |
| POST | `/api/v1/me/reviews` | Tạo review | Customer JWT | Owner |
| PATCH | `/api/v1/me/reviews/{reviewId}` | Cập nhật review của tôi | Customer JWT | Owner |
| DELETE | `/api/v1/me/reviews/{reviewId}` | Xóa/ẩn review của tôi | Customer JWT | Owner |
| GET | `/api/v1/admin/reviews` | Danh sách review moderation | Staff JWT | `reviews:read` |
| PATCH | `/api/v1/admin/reviews/{reviewId}/moderation` | Duyệt/từ chối/ẩn review | Staff/Manager JWT | `reviews:moderate` |

## REST Resource / Tài nguyên REST

- Primary resource: `reviews`.
- Related resource: `products`.
- Action resource: `moderation`.

## HTTP Method / Phương thức HTTP

- GET cho list/summary.
- POST tạo review.
- PATCH update/moderation.
- DELETE xóa mềm/ẩn review owner.

## URI Convention / Quy ước URI

- Public product review: `/api/v1/public/products/{productId}/reviews`.
- Customer review: `/api/v1/me/reviews`.
- Admin moderation: `/api/v1/admin/reviews`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public xem Review published, active.
- Customer tạo/sửa review của mình.
- Staff/Manager moderate theo quyền.

## Authentication / Xác thực

- Public list không cần JWT.
- Create/update/delete cần Customer JWT.
- Moderation cần Staff JWT.

## Authorization / Phân quyền

- Owner check với `/me/reviews`.
- Admin moderation vẫn ngoài runtime Prompt 33.2.
- Public không thấy pending/rejected/hidden.

## Request Contract / Contract request

- Create dùng `{orderId, productId, rating, content}`; không có `customerId`/`verifiedPurchase`.
- Update chỉ nhận rating/content và phải có ít nhất một field.
- Moderation dùng action request có status và reason.
- List dùng pagination/filter/search/sort.

## Response Contract / Contract response

- Public item không expose Customer email/phone/internal ID hoặc Order ID.
- Owner list có Product summary, status, verified evidence và optional eligibility opportunity.
- Rating summary có average, total và distribution 1–5.

## Error Contract / Contract lỗi

- `PERMISSION.REVIEW.ELIGIBLE_PURCHASE_REQUIRED`
- `BUSINESS.REVIEW.ALREADY_REVIEWED`
- `PERMISSION.REVIEW.OWNER_REQUIRED`
- `NOT_FOUND.REVIEW.REVIEW_NOT_FOUND`
- `NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND`

## Validation Rule / Quy tắc validation

- Rating integer 1–5.
- Trimmed content 3–2000 characters.
- Product/order reference hợp lệ.
- Moderation status hợp lệ.

## Business Rule / Quy tắc nghiệp vụ

- Create khóa và dùng owner-scoped active Order Item cùng authoritative completed/delivered state/timestamps trong một transaction.
- Exact duplicate identity là Order+Product với DB unique `(tenant_id, order_id, product_id)`.
- V1 mặc định published; owner edit giữ published, owner delete soft-delete. Return revoke verified evidence nhưng giữ content; Payment refund riêng không phải fulfillment authority.
- Public aggregate/list chỉ tính active/published Review.

## Pagination / Phân trang

- Public/customer list default 10, maximum 50.

## Filter / Lọc

- Customer list hỗ trợ exact `productId`; public V1 không nhận generic filter.

## Search / Tìm kiếm

- Không triển khai search trong V1.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Review media nếu có đi qua Media API.

## Download / Download

Không áp dụng trong Prompt 10.

## Rate Limit / Giới hạn gọi API

- Public read: Public Normal.
- Create/update review: Strict.
- Moderation: Authenticated Normal.

## Idempotency / Chống gửi lặp

- Exact retry chống trùng bằng Order/Product identity và normalized payload; conflicting duplicate trả 409.
- Delete owner idempotent; update/delete serialize bằng Review row lock.
- Moderation idempotent theo desired status.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI review summary thuộc AI API và chỉ dùng approved/public hoặc admin-scoped review theo quyền.
