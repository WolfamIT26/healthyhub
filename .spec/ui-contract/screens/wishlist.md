# Wishlist Screen / Màn hình yêu thích

## Screen Overview / Tổng quan màn hình

Wishlist hiển thị các sản phẩm customer đã lưu.

## Business Goal / Mục tiêu kinh doanh

Giúp khách quay lại sản phẩm quan tâm và tăng khả năng mua sau.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/account/wishlist` | Danh sách yêu thích. |

## Permission / Phân quyền

Customer/member/VIP, owner only.

## Required API / API bắt buộc

- `GET /api/v1/me/wishlist`.
- `POST /api/v1/me/wishlist/items`.
- `DELETE /api/v1/me/wishlist/items/{wishlistItemId}`.
- `DELETE /api/v1/me/wishlist/products/{productId}`.
- `POST /api/v1/cart/items`.

## Required Data / Dữ liệu bắt buộc

Wishlist item list, product summary, stock status, addedAt, pagination metadata nếu có.

## UI Sections / Khu vực UI

Wishlist list, product quick action, remove action, pagination.

## Components / Thành phần

Product Card, Wishlist Remove Button, Add To Cart Button, Pagination, Empty State.

## Form / Form

Không có form chính.

## Validation / Validation

ProductId/wishlistItemId hợp lệ và owner check.

## Search / Tìm kiếm

Search trong wishlist nếu API hỗ trợ.

## Filter / Lọc

Lọc theo stockStatus hoặc category nếu API hỗ trợ.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20 nếu nhiều item.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton product cards.

## Empty State / Trạng thái rỗng

Chưa có sản phẩm yêu thích, link đến Product List.

## Error State / Trạng thái lỗi

Owner required, item not found hoặc product unavailable.

## Success State / Trạng thái thành công

Thêm vào giỏ hoặc xóa wishlist thành công.

## Confirmation Dialog / Hộp xác nhận

Xác nhận xóa nếu cần, có thể bỏ qua với undo toast ở bước frontend sau.

## Toast Message / Toast

Đã xóa khỏi yêu thích, đã thêm vào giỏ, lỗi tồn kho.

## Skeleton / Skeleton

Skeleton product card.

## Responsive Behavior / Hành vi responsive

Mobile dùng card list; desktop có thể grid.

## Accessibility / Khả năng tiếp cận

Remove button có label sản phẩm, stock status có text.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.

