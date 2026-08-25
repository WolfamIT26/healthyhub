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

- Review mutation yêu cầu authenticated Customer, owner-scoped Order và Product nằm trong persisted Order Item.
- “Mua hàng hợp lệ” requires owned Order `completed`, Shipment `delivered`, both timestamps and active Order Item Product; Review Eligibility is **READY**.
- Không suy diễn eligibility từ Cart/Wishlist, OrderPlaced, Payment paid, Order confirmed hoặc Inventory consumed.
- V1 publication mặc định published; hidden/rejected được schema giữ cho future approved moderation authority.
- Không chỉnh sửa review làm sai ý kiến khách.

Duplicate identity is `Order + Product`. Cancel/return revokes eligibility; existing content remains public but loses verified-purchase evidence. Payment refund alone does not define fulfillment. V1 defaults to published, owner edit in-place and owner soft delete. Create locks Order then Shipment and rechecks evidence atomically; DB uniqueness is final authority.

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
