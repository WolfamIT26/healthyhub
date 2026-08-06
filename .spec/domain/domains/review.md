# Review Domain / Domain đánh giá

## Purpose / Mục đích

Quản lý đánh giá sản phẩm từ khách hàng và kiểm duyệt nội dung review.

## Responsibility / Trách nhiệm

- Ghi nhận review sản phẩm.
- Kiểm tra điều kiện review hợp lệ.
- Quản lý trạng thái public/hidden/moderation.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `ProductReview`
- Entity: `ReviewModeration`, `ReviewReport`
- Value Object: `Rating`, `ReviewContent`, `ModerationReason`
- Enum: `ReviewStatus`, `ModerationStatus`, `ReviewSource`

## Relationships / Quan hệ với domain khác

- Review phụ thuộc Customer, Product và Order.
- AI có thể tóm tắt review public hợp lệ.
- Analytics đọc review để hiểu phản hồi khách.

## Business Rule / Quy tắc nghiệp vụ

- Review nên ưu tiên khách có mua hàng hợp lệ.
- Review vi phạm policy phải bị ẩn hoặc kiểm duyệt.
- Không chỉnh sửa review làm sai ý kiến khách.

## Domain Event / Sự kiện domain

- `ReviewSubmitted`
- `ReviewPublished`
- `ReviewHidden`
- `ReviewReported`

## Dependency / Phụ thuộc

- Core dependency: Customer, Product, Order
- Downstream: AI, Analytics

## Boundary / Ranh giới

Review không quản lý product content hoặc customer profile. Domain này chỉ sở hữu phản hồi và trạng thái kiểm duyệt.

