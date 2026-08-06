# Blog Database / Database domain bài viết

## Storage Purpose / Mục đích lưu trữ

Lưu bài viết healthy, block nội dung, liên kết media và metadata SEO để hỗ trợ giáo dục khách hàng, SEO và marketing có kiểm duyệt.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `blog_posts` | Bài viết chính. |
| `blog_content_blocks` | Khối nội dung trong bài. |
| `blog_media_links` | Liên kết bài viết với media. |
| `seo_metadata` | Metadata SEO cho blog hoặc content entity. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `blog_posts` | `id` | `tenant_id`, `post_title`, `post_slug`, `post_summary`, `post_status`, `content_review_status`, `health_disclaimer`, `published_at` | `author_user_id` -> User | draft, review, published, hidden, archived |
| `blog_content_blocks` | `id` | `tenant_id`, `block_type`, `block_content`, `display_order`, `block_status` | `blog_post_id` | draft, active, hidden |
| `blog_media_links` | `id` | `tenant_id`, `media_role`, `display_order`, `link_status` | `blog_post_id`, `media_asset_id` -> Media | active, inactive |
| `seo_metadata` | `id` | `tenant_id`, `seo_title`, `seo_description`, `canonical_reference`, `seo_status` | `blog_post_id` nullable, `product_id` -> Product nullable | draft, active, stale |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một blog post có thể có một `seo_metadata` chính.
- 1-N: Một blog post có nhiều content block và media link.
- N-N: Blog và Media qua `blog_media_links`; Blog và Product có thể mở rộng bằng link entity tương lai.
- Cardinality: Blog published phải có ít nhất một content block active.

## Business Constraints / Ràng buộc nghiệp vụ

- Blog public phải có tiêu đề, slug, nội dung và review status phù hợp.
- Nội dung healthy không thay thế tư vấn y tế.
- Nội dung do AI tạo cần review người thật trước khi public.

## Delete Strategy / Chiến lược xóa

- Blog dùng hidden/archive thay vì hard delete khi đã public.
- Content block có thể hidden; hard delete chỉ với draft chưa public.
- SEO metadata có thể stale khi nội dung đổi.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn, thêm `published_at`, `reviewed_by`, `reviewed_at` nếu có review workflow.

## Data Lifecycle / Vòng đời dữ liệu

Blog đi từ draft, review, published, hidden hoặc archived. SEO metadata cập nhật theo version nội dung.

## Data Ownership / Sở hữu dữ liệu

Blog domain sở hữu bài viết và SEO metadata nội dung. Media và Product giữ ownership dữ liệu gốc được tham chiếu.

## Data Validation / Validation dữ liệu

- `post_slug` unique theo tenant.
- `post_title` và content block bắt buộc trước khi published.
- `health_disclaimer` bắt buộc với nội dung dinh dưỡng hoặc sức khỏe nhạy cảm.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `post_title` | `blog_posts` | Tiêu đề bài viết. | Bắt buộc khi review/publish. |
| `post_slug` | `blog_posts` | Slug SEO. | Unique theo tenant. |
| `content_review_status` | `blog_posts` | Trạng thái review nội dung. | draft, needs_review, approved, rejected. |
| `block_content` | `blog_content_blocks` | Nội dung block. | Không chứa claim y tế sai lệch. |
| `seo_description` | `seo_metadata` | Mô tả SEO. | Không nhồi từ khóa. |
