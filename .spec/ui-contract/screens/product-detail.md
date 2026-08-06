# Product Detail Screen / Màn hình chi tiết sản phẩm

## Screen Overview / Tổng quan màn hình

Màn hình chi tiết sản phẩm hiển thị thông tin bán hàng, hình ảnh, thành phần, dinh dưỡng, review và gợi ý AI public-safe.

## Business Goal / Mục tiêu kinh doanh

Giúp khách hiểu sản phẩm đủ rõ để thêm vào giỏ và mua hàng, đồng thời giảm rủi ro hiểu sai thông tin dinh dưỡng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/products/:productId` | Chi tiết sản phẩm public. |

## Permission / Phân quyền

Public chỉ xem sản phẩm active/visible.

## Required API / API bắt buộc

- `GET /api/v1/public/products/{productId}`.
- `GET /api/v1/public/products/{productId}/reviews`.
- `GET /api/v1/public/products/{productId}/reviews/summary`.
- `POST /api/v1/cart/items`.
- `POST /api/v1/ai/compare/products` hoặc `POST /api/v1/ai/recommendations/products` nếu user dùng AI.

## Required Data / Dữ liệu bắt buộc

Product detail, media gallery, price, stock status, category/brand summary, ingredient/nutrition summary, review summary, related product summary.

## UI Sections / Khu vực UI

Media gallery, product summary, purchase action, ingredient/nutrition section, review section, related products, AI helper.

## Components / Thành phần

Media Gallery, Price Summary, Stock Badge, Quantity Stepper, Add To Cart Button, Review Summary, AI Entry.

## Form / Form

Add-to-cart form gồm quantity và option nếu có.

## Validation / Validation

Quantity là số nguyên dương, không vượt giới hạn bán; product phải sellable.

## Search / Tìm kiếm

Không có search chính; related navigation dẫn lại Product List.

## Filter / Lọc

Review filter theo rating nếu API hỗ trợ.

## Sort / Sắp xếp

Review default `createdAt` desc.

## Pagination / Phân trang

Review list phân trang default 20 nếu hiển thị nhiều review.

## Upload / Upload

Không áp dụng; review media nếu có thuộc Customer Reviews sau này.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton cho gallery, summary, action và review summary.

## Empty State / Trạng thái rỗng

Nếu chưa có review, hiển thị trạng thái chưa có đánh giá.

## Error State / Trạng thái lỗi

Product not found hiển thị màn hình không tìm thấy; add-to-cart lỗi hiển thị theo Cart/Product error.

## Success State / Trạng thái thành công

Thêm vào giỏ thành công cập nhật cart badge và hiển thị toast.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng cho add-to-cart thường.

## Toast Message / Toast

Thêm sản phẩm vào giỏ thành công, sản phẩm hết hàng, hoặc quantity không hợp lệ.

## Skeleton / Skeleton

Skeleton giữ tỷ lệ gallery và summary để tránh nhảy layout.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên ảnh, tên, giá, stock và action; desktop có thể đặt gallery và summary cạnh nhau ở bước design sau.

## Accessibility / Khả năng tiếp cận

Ảnh có alt text, quantity có label, stock status có text, thành phần/dị ứng không chỉ biểu diễn bằng màu.

## SEO Metadata / SEO metadata

Product title, description, product structured data, canonical URL và image metadata.

