# Promotion Domain / Domain khuyến mãi

## Purpose / Mục đích

Quản lý chương trình ưu đãi theo thời gian, sản phẩm, khách hàng hoặc chiến dịch.

## Responsibility / Trách nhiệm

- Định nghĩa điều kiện và thời gian promotion.
- Quản lý trạng thái chiến dịch ưu đãi.
- Xác định rule ưu tiên/cộng dồn với Coupon.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Promotion`
- Entity: `PromotionCondition`, `PromotionSchedule`, `PromotionTarget`
- Value Object: `PromotionName`, `CampaignPeriod`, `DiscountPolicy`
- Enum: `PromotionStatus`, `PromotionType`, `StackingRule`

## Relationships / Quan hệ với domain khác

- Promotion áp dụng lên Product hoặc nhóm Customer.
- Coupon có thể thuộc Promotion.
- Analytics đo hiệu quả promotion.
- AI Marketing có thể gợi ý nội dung campaign.

## Business Rule / Quy tắc nghiệp vụ

- Promotion phải có thời gian hiệu lực rõ.
- Điều kiện promotion không được mâu thuẫn.
- Promotion đang chạy cần hạn chế chỉnh sửa gây sai báo cáo.
- Nhiều promotion cùng lúc cần rule ưu tiên.

## Domain Event / Sự kiện domain

- `PromotionCreated`
- `PromotionActivated`
- `PromotionEnded`
- `PromotionRuleChanged`

## Dependency / Phụ thuộc

- Core dependency: Product, Customer, Coupon
- Downstream: Cart, Order, Analytics, AI

## Boundary / Ranh giới

Promotion không xử lý thanh toán hoặc gửi notification trực tiếp. Notification domain chịu trách nhiệm gửi thông tin campaign khi được yêu cầu.

