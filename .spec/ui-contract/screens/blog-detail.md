# Blog Detail Screen / Màn hình chi tiết blog

## Screen Overview / Tổng quan màn hình

Màn hình blog detail hiển thị nội dung healthy đã publish, media và sản phẩm liên quan nếu có.

## Business Goal / Mục tiêu kinh doanh

Giáo dục khách hàng, tăng SEO và dẫn về sản phẩm phù hợp.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/blog/:postId` | Chi tiết bài viết public. |

## Permission / Phân quyền

Public chỉ xem bài published.

## Required API / API bắt buộc

- `GET /api/v1/public/blog-posts/{postId}`.
- `GET /api/v1/public/products` nếu hiển thị sản phẩm liên quan.

## Required Data / Dữ liệu bắt buộc

Blog detail, content public, media, SEO metadata, related product summary.

## UI Sections / Khu vực UI

Article header, content, media, related products, related posts nếu có.

## Components / Thành phần

Content Detail, Media Display, Product Card, SEO Metadata Contract.

## Form / Form

Không áp dụng.

## Validation / Validation

PostId hợp lệ từ route.

## Search / Tìm kiếm

Không áp dụng trong màn hình chính.

## Filter / Lọc

Không áp dụng.

## Sort / Sắp xếp

Related products theo API.

## Pagination / Phân trang

Không áp dụng.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton article header và content blocks.

## Empty State / Trạng thái rỗng

Không áp dụng; nếu không có post dùng not found.

## Error State / Trạng thái lỗi

Post not found hoặc không published hiển thị not found public-safe.

## Success State / Trạng thái thành công

Content hiển thị đầy đủ, related links hoạt động.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Không áp dụng.

## Skeleton / Skeleton

Skeleton giữ vùng title, metadata, thumbnail và paragraph.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên đọc bài thoải mái; related products xuống dưới nội dung.

## Accessibility / Khả năng tiếp cận

Heading hierarchy rõ, ảnh có alt text, link sản phẩm liên quan có tên cụ thể.

## SEO Metadata / SEO metadata

Title, description, canonical, publishedAt, image và article structured data.

