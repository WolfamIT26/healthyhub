# Wishlist API Specification / Đặc tả API danh sách yêu thích

## API Overview / Tổng quan API

Wishlist API quản lý danh sách sản phẩm khách hàng lưu để xem hoặc mua sau.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/me/wishlist` | Danh sách wishlist của tôi | Customer JWT | Owner |
| POST | `/api/v1/me/wishlist/items` | Thêm sản phẩm vào wishlist | Customer JWT | Owner |
| DELETE | `/api/v1/me/wishlist/items/{wishlistItemId}` | Xóa item khỏi wishlist | Customer JWT | Owner |
| DELETE | `/api/v1/me/wishlist/products/{productId}` | Xóa theo product | Customer JWT | Owner |

## REST Resource / Tài nguyên REST

- Primary resource: `wishlist`.
- Child resources: `items`, `products`.

## HTTP Method / Phương thức HTTP

- GET cho list.
- POST thêm item.
- DELETE xóa item.

## URI Convention / Quy ước URI

- Customer namespace: `/api/v1/me/wishlist`.
- ID parameter dùng `{wishlistItemId}` hoặc `{productId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Chỉ customer/member/VIP đã đăng nhập.
- Owner only.

## Authentication / Xác thực

- Bắt buộc Customer JWT.

## Authorization / Phân quyền

- Customer chỉ truy cập wishlist của chính mình.

## Request Contract / Contract request

- Add request typed chỉ gồm `productId`; `additionalProperties=false`.
- Delete theo wishlistItemId hoặc productId.
- API không nhận `customerId`; owner được derive từ Customer JWT qua active CustomerProfile.

## Response Contract / Contract response

- Wishlist list trả `items`, `page`, `pageSize`, `totalItems`, `totalPages`.
- Item trả safe current Product summary, availability và `addedAt`; không trả Wishlist/customer/audit metadata nội bộ.
- Add trả item authoritative; Delete trả `{ productId, deleted: true }` trong standard success envelope.

## Error Contract / Contract lỗi

- `NOT_FOUND.WISHLIST.ITEM_NOT_FOUND`
- `PERMISSION.WISHLIST.OWNER_REQUIRED`
- `NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND`
- Duplicate add không phải lỗi; trả item active hiện hữu.

## Validation Rule / Quy tắc validation

- ProductId hợp lệ và product tồn tại.
- Không thêm trùng nếu wishlist đã có product.

## Business Rule / Quy tắc nghiệp vụ

- Wishlist không giữ giá cố định; giá lấy từ Product khi hiển thị.
- Product đã lưu nhưng không còn public/active được trả dạng `UNAVAILABLE` không kèm metadata nhạy cảm.
- Product hết hàng vẫn được add và hiển thị `OUT_OF_STOCK`.
- Internal account không dùng Customer Wishlist.

## Pagination / Phân trang

- Wishlist list dùng page pagination, default 20, max 60 và stable sort `savedAt DESC, id DESC`.

## Filter / Lọc

- V1 không nhận filter chưa executable.

## Search / Tìm kiếm

- V1 không nhận search chưa executable.

## Sort / Sắp xếp

- Default sort: `savedAt` desc rồi `id` desc; client không chọn sort trong V1.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Rate Limit / Giới hạn gọi API

- Authenticated Normal.

## Idempotency / Chống gửi lặp

- Add idempotent theo unique Wishlist/Product lifecycle và Customer row lock; không yêu cầu client idempotency key.
- Delete theo Product là idempotent. Delete theo item không thuộc owner trả cùng 404 như item không tồn tại.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

Không có AI endpoint trong V1.

## Executable Decision / Quyết định đã thực thi

Prompt 30 triển khai một default private Wishlist lazy-created cho mỗi Customer trên `wishlists` và `wishlist_items`. Membership là persistence authority; giá và availability luôn đọc lại từ Product/Inventory authority hiện hành. Double-click/concurrent add được serialize và DB unique constraint bảo vệ.
