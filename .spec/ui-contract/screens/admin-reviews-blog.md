# Admin Reviews Blog Screen / Màn hình quản lý review và blog

## Screen Overview / Tổng quan màn hình

Màn hình này hỗ trợ moderation review và quản lý nội dung blog healthy/SEO.

## Business Goal / Mục tiêu kinh doanh

Đảm bảo review public chất lượng, nội dung blog đúng trạng thái publish và hỗ trợ SEO.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/content` | Tổng hợp review/blog. |
| `/admin/reviews` | Moderation review nếu tách route. |
| `/admin/blog-posts` | Quản lý blog nếu tách route. |

## Permission / Phân quyền

Staff limited đọc/tạo draft; manager/admin moderate, publish và archive.

## Required API / API bắt buộc

- `GET /api/v1/admin/reviews`.
- `PATCH /api/v1/admin/reviews/{reviewId}/moderation`.
- `GET /api/v1/admin/blog-posts`.
- `POST /api/v1/admin/blog-posts`.
- `GET /api/v1/admin/blog-posts/{postId}`.
- `PATCH /api/v1/admin/blog-posts/{postId}`.
- `PATCH /api/v1/admin/blog-posts/{postId}/status`.
- `POST /api/v1/admin/blog-posts/{postId}/media`.

## Required Data / Dữ liệu bắt buộc

Review list/detail, moderation status, blog list/detail, SEO metadata, media summary, publish status.

## UI Sections / Khu vực UI

Review moderation queue, blog table, blog form, SEO metadata panel, media attach, status action.

## Components / Thành phần

Admin Table, Review Card, Moderation Panel, Blog Form, SEO Metadata Form, Media Picker, Confirmation Dialog.

## Form / Form

Review moderation reason; blog title, slug, summary, content, SEO metadata, status.

## Validation / Validation

Review status/reason, blog title/slug/content required when publish, SEO metadata length, unique slug.

## Search / Tìm kiếm

Review search theo content/product/customer masked; blog search theo title/slug/summary.

## Filter / Lọc

ReviewStatus, rating, productId, postStatus, author, publishedAt, createdAt.

## Sort / Sắp xếp

Review default `createdAt` desc; blog default `updatedAt` desc.

## Pagination / Phân trang

Default 20.

## Upload / Upload

Blog media đi qua Admin Media và attach tại màn hình này.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Table/list skeleton, blog form submit loading, moderation action loading.

## Empty State / Trạng thái rỗng

Không có review cần duyệt hoặc chưa có blog post.

## Error State / Trạng thái lỗi

Purchase required, already reviewed, cannot publish, slug conflict, permission denied.

## Success State / Trạng thái thành công

Review moderated hoặc blog saved/published.

## Confirmation Dialog / Hộp xác nhận

Reject/hide review, publish/archive blog cần xác nhận.

## Toast Message / Toast

Moderation, save, publish, archive thành công hoặc lỗi.

## Skeleton / Skeleton

Review card/table và blog form skeleton.

## Responsive Behavior / Hành vi responsive

Desktop tabs cho review/blog; mobile list và detail full-screen.

## Accessibility / Khả năng tiếp cận

Rating có text, moderation reason label rõ, SEO field có mô tả.

## SEO Metadata / SEO metadata

Admin screen noindex; blog form quản lý SEO metadata cho Blog Detail public.

