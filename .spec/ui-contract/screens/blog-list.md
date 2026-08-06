# Blog List Screen / Màn hình danh sách blog

## Screen Overview / Tổng quan màn hình

Màn hình blog list hiển thị nội dung healthy/SEO đã publish.

## Business Goal / Mục tiêu kinh doanh

Tăng niềm tin, hỗ trợ SEO và dẫn người dùng đến sản phẩm liên quan.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/blog` | Danh sách bài viết public. |

## Permission / Phân quyền

Public.

## Required API / API bắt buộc

- `GET /api/v1/public/blog-posts`.

## Required Data / Dữ liệu bắt buộc

Blog card list, pagination metadata, search/filter/sort metadata nếu dùng.

## UI Sections / Khu vực UI

Header, search, category/tag filter nếu có, blog card list, pagination.

## Components / Thành phần

Search Input, Blog Card, Filter Bar, Pagination, Empty State.

## Form / Form

Search form đơn giản.

## Validation / Validation

Keyword trim và giới hạn độ dài.

## Search / Tìm kiếm

Search theo title, slug, summary và content keywords nếu API hỗ trợ.

## Filter / Lọc

Lọc theo category/tag/status published nếu có.

## Sort / Sắp xếp

Default `publishedAt` desc.

## Pagination / Phân trang

Default 20.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton blog cards.

## Empty State / Trạng thái rỗng

Không có bài viết hoặc không có kết quả theo filter/search.

## Error State / Trạng thái lỗi

Hiển thị error state và retry.

## Success State / Trạng thái thành công

Blog cards và pagination hiển thị đúng.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Không áp dụng.

## Skeleton / Skeleton

Skeleton card giữ vùng title, summary và thumbnail.

## Responsive Behavior / Hành vi responsive

Mobile hiển thị danh sách một cột; desktop có thể nhiều cột ở bước design sau.

## Accessibility / Khả năng tiếp cận

Article card có heading rõ, ảnh có alt text, link đọc tiếp có label cụ thể.

## SEO Metadata / SEO metadata

Title/description cho blog index, canonical URL và structured data danh sách bài viết nếu cần.

