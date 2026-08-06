# Blog Domain / Domain bài viết

## Purpose / Mục đích

Quản lý nội dung bài viết healthy, giáo dục khách hàng và hỗ trợ SEO.

## Responsibility / Trách nhiệm

- Quản lý lifecycle bài viết: nháp, review, public, hidden.
- Bảo vệ rule không đưa lời khuyên y tế sai lệch.
- Liên kết bài viết với media và sản phẩm khi phù hợp.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `BlogPost`
- Entity: `BlogContentBlock`, `BlogMediaLink`, `SeoMetadata`
- Value Object: `PostTitle`, `PostSlug`, `PostSummary`, `HealthDisclaimer`
- Enum: `PostStatus`, `ContentReviewStatus`, `SeoStatus`

## Relationships / Quan hệ với domain khác

- Blog dùng Media.
- Product có thể được liên kết trong bài.
- AI Marketing có thể tạo draft cần review.

## Business Rule / Quy tắc nghiệp vụ

- Blog public phải có tiêu đề và nội dung.
- Nội dung không thay thế tư vấn y tế.
- AI-generated content cần review người thật trước khi public.
- SEO không được nhồi từ khóa.

## Domain Event / Sự kiện domain

- `BlogDraftCreated`
- `BlogPostPublished`
- `BlogPostHidden`
- `BlogContentReviewed`

## Dependency / Phụ thuộc

- Supporting dependency: Media, Product, AI

## Boundary / Ranh giới

Blog không quản lý catalog product hay campaign promotion. Domain này sở hữu nội dung editorial.

