# Blog API Specification / Đặc tả API blog

## API Overview / Tổng quan API

Blog API quản lý nội dung healthy, bài viết SEO, trạng thái publish, media liên quan và metadata hiển thị storefront.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/blog-posts` | Danh sách bài viết public | Public | Public |
| GET | `/api/v1/public/blog-posts/{postId}` | Chi tiết bài viết public | Public | Public |
| GET | `/api/v1/admin/blog-posts` | Danh sách bài viết admin | Staff JWT | `blog:read` |
| POST | `/api/v1/admin/blog-posts` | Tạo bài viết | Staff/Manager JWT | `blog:manage` |
| GET | `/api/v1/admin/blog-posts/{postId}` | Chi tiết bài viết admin | Staff JWT | `blog:read` |
| PATCH | `/api/v1/admin/blog-posts/{postId}` | Cập nhật bài viết | Staff/Manager JWT | `blog:manage` |
| PATCH | `/api/v1/admin/blog-posts/{postId}/status` | Draft/publish/archive | Manager/Admin JWT | `blog:manage` |
| POST | `/api/v1/admin/blog-posts/{postId}/media` | Gắn media bài viết | Staff/Manager JWT | `blog:manage` |

## REST Resource / Tài nguyên REST

- Primary resource: `blog-posts`.
- Related resource: `media`.
- Action resource: `status`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail.
- POST cho create/media attach.
- PATCH cho update/status.

## URI Convention / Quy ước URI

- Public namespace: `/api/v1/public/blog-posts`.
- Admin namespace: `/api/v1/admin/blog-posts`.
- ID parameter dùng `{postId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public xem bài published.
- Staff đọc/tạo draft theo quyền.
- Manager/Admin publish/archive.

## Authentication / Xác thực

- Public endpoint không cần JWT.
- Admin endpoint bắt buộc Staff JWT trở lên.

## Authorization / Phân quyền

- Draft/scheduled/archived chỉ admin có quyền xem.
- Publish cần quyền `blog:manage`.

## Request Contract / Contract request

- Blog create/update dùng command input.
- List dùng pagination/filter/search/sort.
- Media attach dùng relationship reference.

## Response Contract / Contract response

- Public blog card/detail trả title, slug, summary, content public, media public và SEO metadata.
- Admin detail trả status, audit summary, scheduling và internal metadata theo quyền.

## Error Contract / Contract lỗi

- `NOT_FOUND.BLOG.POST_NOT_FOUND`
- `CONFLICT.BLOG.SLUG_EXISTS`
- `BUSINESS.BLOG.CANNOT_PUBLISH`

## Validation Rule / Quy tắc validation

- Title/slug required và unique.
- Content không rỗng khi publish.
- SEO metadata phải có độ dài phù hợp.
- Media reference phải hợp lệ.

## Business Rule / Quy tắc nghiệp vụ

- Chỉ bài published mới public.
- Scheduled post không public trước thời điểm publish.
- AI marketing/content output phải được người có quyền duyệt trước khi publish nếu dùng.

## Pagination / Phân trang

- Public/admin list dùng page pagination default 20.

## Filter / Lọc

- Public: category/tag/status published.
- Admin: `postStatus`, author, publishedAt, createdAt.

## Search / Tìm kiếm

- Search theo title, slug, summary và content keywords.

## Sort / Sắp xếp

- Public default: `publishedAt` desc.
- Admin default: `updatedAt` desc.

## Upload / Upload

- Upload media đi qua Media API.

## Download / Download

Không áp dụng trong Prompt 10.

## Rate Limit / Giới hạn gọi API

- Public blog: Public Normal.
- Admin management: Authenticated Normal.

## Idempotency / Chống gửi lặp

- Status publish/archive nên idempotent theo desired state.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI caption/content assistant nằm ở AI API. Blog API chỉ nhận nội dung đã được duyệt.

