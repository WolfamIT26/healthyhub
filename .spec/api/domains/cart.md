# Cart API Specification / Đặc tả API giỏ hàng

## API Overview / Tổng quan API

Cart API quản lý giỏ hàng cho guest và customer, thêm/sửa/xóa item, áp dụng coupon và tính lại price summary. Backend không tin total do client gửi.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/cart` | Xem giỏ hàng hiện tại | Guest token hoặc Customer JWT | Cart owner |
| POST | `/api/v1/cart/items` | Thêm sản phẩm vào giỏ | Guest token hoặc Customer JWT | Cart owner |
| PATCH | `/api/v1/cart/items/{cartItemId}` | Cập nhật số lượng item | Guest token hoặc Customer JWT | Cart owner |
| DELETE | `/api/v1/cart/items/{cartItemId}` | Xóa item khỏi giỏ | Guest token hoặc Customer JWT | Cart owner |
| POST | `/api/v1/cart/apply-coupon` | Áp dụng coupon | Guest token hoặc Customer JWT | Cart owner |
| DELETE | `/api/v1/cart/coupon` | Gỡ coupon | Guest token hoặc Customer JWT | Cart owner |
| POST | `/api/v1/cart/validate` | Validate giỏ hàng trước checkout | Guest token hoặc Customer JWT | Cart owner |
| POST | `/api/v1/cart/merge` | Gộp cart guest vào customer | Customer JWT | Cart owner |

## REST Resource / Tài nguyên REST

- Primary resource: `cart`.
- Child resource: `items`.
- Action resources: `apply-coupon`, `validate`, `merge`.

## HTTP Method / Phương thức HTTP

- GET xem cart.
- POST thêm item/action.
- PATCH cập nhật item.
- DELETE xóa item/coupon.

## URI Convention / Quy ước URI

- Shared cart namespace: `/api/v1/cart`.
- Item ID dùng `{cartItemId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Guest dùng cart token hoặc session định danh tạm.
- Customer dùng JWT và chỉ truy cập cart của mình.

## Authentication / Xác thực

- Guest token hoặc Customer JWT.
- Checkout sau đó có thể cho guest limited theo business rule.

## Authorization / Phân quyền

- Owner check bắt buộc.
- Staff/admin không dùng Cart API để thao tác cart khách nếu không có support feature riêng.

## Request Contract / Contract request

- Add/update item dùng command input với productId, quantity và option nếu có.
- Apply coupon dùng coupon code.
- Validate dùng action request, không gửi total tự tính.

## Response Contract / Contract response

- Cart detail trả items, availability, price summary, coupon validation result và warnings.
- Price summary do backend tính.

## Error Contract / Contract lỗi

- `BUSINESS.CART.ITEM_UNAVAILABLE`
- `BUSINESS.CART.COUPON_NOT_APPLICABLE`
- `VALIDATION.CART.INVALID_QUANTITY`
- `BUSINESS.INVENTORY.INSUFFICIENT_STOCK`

## Validation Rule / Quy tắc validation

- Quantity là số nguyên dương trong giới hạn.
- Product phải sellable.
- Coupon format hợp lệ.
- Cart item phải thuộc cart owner.

## Business Rule / Quy tắc nghiệp vụ

- Cart phải kiểm tra lại giá và tồn kho trước checkout.
- Coupon chỉ áp dụng khi đủ điều kiện.
- Cart guest có thể merge vào customer sau login.

## Pagination / Phân trang

Không áp dụng thông thường vì cart size có giới hạn.

## Filter / Lọc

Không áp dụng.

## Search / Tìm kiếm

Không áp dụng.

## Sort / Sắp xếp

Item sort theo thời điểm thêm hoặc display order do backend quyết định.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Rate Limit / Giới hạn gọi API

- Cart read/update: Authenticated Normal.
- Apply coupon/validate/merge: Strict.

## Idempotency / Chống gửi lặp

- Add item có thể idempotent theo productId và option nếu API sau này chọn cộng dồn hoặc set quantity.
- Validate cart idempotent.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI recommendation từ cart context thuộc AI API, Cart API không gọi AI trực tiếp.

