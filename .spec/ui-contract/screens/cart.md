# Cart Screen / Màn hình giỏ hàng

## Screen Overview / Tổng quan màn hình

Màn hình giỏ hàng cho guest/customer xem item, chỉnh số lượng, áp dụng coupon và chuyển sang checkout.

## Business Goal / Mục tiêu kinh doanh

Giảm rơi rớt giỏ hàng, hiển thị giá/tồn kho rõ và đưa khách đến bước đặt hàng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/cart` | Giỏ hàng hiện tại. |

## Permission / Phân quyền

Guest token hoặc Customer JWT, cart owner only.

## Required API / API bắt buộc

- `GET /api/v1/cart`.
- `POST /api/v1/cart/items`.
- `PATCH /api/v1/cart/items/{cartItemId}`.
- `DELETE /api/v1/cart/items/{cartItemId}`.
- `POST /api/v1/cart/apply-coupon`.
- `DELETE /api/v1/cart/coupon`.
- `POST /api/v1/cart/validate`.

## Required Data / Dữ liệu bắt buộc

Cart detail, cart items, price summary, coupon validation result, product availability, warnings.

## UI Sections / Khu vực UI

Cart item list, coupon form, price summary, checkout action, recommendation entry nếu có.

## Components / Thành phần

Cart Item, Quantity Stepper, Coupon Form, Price Summary, Checkout Button, Confirmation Dialog.

## Form / Form

Coupon code form và quantity update.

## Validation / Validation

Quantity là số nguyên dương; coupon code trim và đúng format.

## Search / Tìm kiếm

Không áp dụng.

## Filter / Lọc

Không áp dụng.

## Sort / Sắp xếp

Cart items theo thứ tự thêm hoặc API trả về.

## Pagination / Phân trang

Không áp dụng vì cart size có giới hạn.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton cart item và price summary; action button disabled khi validate/update.

## Empty State / Trạng thái rỗng

Hiển thị giỏ hàng trống và link quay lại Product List.

## Error State / Trạng thái lỗi

Item unavailable, insufficient stock, coupon not applicable hoặc cart owner invalid.

## Success State / Trạng thái thành công

Quantity/coupon cập nhật thành công, price summary được refresh.

## Confirmation Dialog / Hộp xác nhận

Xác nhận xóa item nếu cần, đặc biệt khi xóa nhiều hoặc item giá trị cao.

## Toast Message / Toast

Cập nhật giỏ hàng, áp dụng/gỡ coupon, lỗi tồn kho hoặc coupon.

## Skeleton / Skeleton

Skeleton giữ cart item rows và summary box.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên item và checkout action dễ bấm; summary có thể đặt cuối hoặc sticky ở bước design sau.

## Accessibility / Khả năng tiếp cận

Quantity control có label, lỗi coupon có text, price summary đọc được rõ.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân/session.

