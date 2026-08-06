# Review API Specification / Đặc tả API đánh giá

## API Overview / Tổng quan API

Review API quản lý đánh giá sản phẩm, rating summary, review của customer và moderation bởi staff/manager/admin.

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

- Public xem approved review.
- Customer tạo/sửa review của mình.
- Staff/Manager moderate theo quyền.

## Authentication / Xác thực

- Public list không cần JWT.
- Create/update/delete cần Customer JWT.
- Moderation cần Staff JWT.

## Authorization / Phân quyền

- Owner check với `/me/reviews`.
- Moderation reason admin only.
- Public không thấy pending/rejected/hidden.

## Request Contract / Contract request

- Create/update review dùng command input.
- Moderation dùng action request có status và reason.
- List dùng pagination/filter/search/sort.

## Response Contract / Contract response

- Review list item public.
- Review detail owner/admin.
- Rating summary aggregate.

## Error Contract / Contract lỗi

- `BUSINESS.REVIEW.PURCHASE_REQUIRED`
- `BUSINESS.REVIEW.ALREADY_REVIEWED`
- `PERMISSION.REVIEW.OWNER_REQUIRED`
- `NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND`

## Validation Rule / Quy tắc validation

- Rating trong range hợp lệ.
- Content đúng độ dài và policy.
- Product/order reference hợp lệ.
- Moderation status hợp lệ.

## Business Rule / Quy tắc nghiệp vụ

- Customer chỉ review sản phẩm đã mua nếu business rule yêu cầu.
- Mỗi order item chỉ review một lần nếu policy áp dụng.
- Review public sau khi approved.

## Pagination / Phân trang

- Public/admin/customer review list default 20.

## Filter / Lọc

- Lọc theo rating, reviewStatus, productId, createdAt.

## Search / Tìm kiếm

- Admin search theo nội dung review, product summary, customer masked.

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

- Create review chống trùng bằng customer/product/order item.
- Moderation idempotent theo desired status.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI review summary thuộc AI API và chỉ dùng approved/public hoặc admin-scoped review theo quyền.

