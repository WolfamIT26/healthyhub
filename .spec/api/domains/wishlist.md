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

- Add request gồm productId.
- Delete theo wishlistItemId hoặc productId.

## Response Contract / Contract response

- Wishlist list trả product summary, stock status và addedAt.
- Delete trả success envelope.

## Error Contract / Contract lỗi

- `BUSINESS.WISHLIST.ALREADY_EXISTS`
- `NOT_FOUND.WISHLIST.ITEM_NOT_FOUND`
- `PERMISSION.WISHLIST.OWNER_REQUIRED`
- `NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND`

## Validation Rule / Quy tắc validation

- ProductId hợp lệ và product tồn tại.
- Không thêm trùng nếu wishlist đã có product.

## Business Rule / Quy tắc nghiệp vụ

- Wishlist không giữ giá cố định; giá lấy từ Product khi hiển thị.
- Product archived có thể vẫn hiện trạng thái unavailable cho owner hoặc bị ẩn tùy policy.

## Pagination / Phân trang

- Wishlist list dùng page pagination nếu nhiều item, default 20.

## Filter / Lọc

- Có thể lọc theo stockStatus hoặc categoryId nếu endpoint hỗ trợ sau.

## Search / Tìm kiếm

- Search theo product name trong wishlist nếu cần.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Rate Limit / Giới hạn gọi API

- Authenticated Normal.

## Idempotency / Chống gửi lặp

- Add item nên idempotent theo productId.
- Delete item nên idempotent.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI recommendation có thể dùng wishlist context qua AI API nếu customer cho phép.

