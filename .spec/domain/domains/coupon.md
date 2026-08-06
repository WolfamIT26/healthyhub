# Coupon Domain / Domain mã giảm giá

## Purpose / Mục đích

Quản lý mã giảm giá có điều kiện áp dụng cho cart hoặc order.

## Responsibility / Trách nhiệm

- Kiểm tra tính hợp lệ của coupon.
- Quản lý điều kiện, thời gian và giới hạn sử dụng.
- Phối hợp Promotion để xử lý rule ưu đãi.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Coupon`
- Entity: `CouponCondition`, `CouponUsage`, `CouponCampaignLink`
- Value Object: `CouponCode`, `DiscountValue`, `UsageLimit`, `ValidityPeriod`
- Enum: `CouponStatus`, `DiscountType`, `CouponEligibilityStatus`

## Relationships / Quan hệ với domain khác

- Cart kiểm tra Coupon trước order.
- Order ghi nhận coupon được áp dụng.
- Promotion có thể phát hành hoặc kết hợp Coupon.
- Customer có thể là điều kiện áp dụng.

## Business Rule / Quy tắc nghiệp vụ

- Coupon chỉ hợp lệ khi còn hạn, đủ điều kiện và chưa vượt giới hạn.
- Coupon không được làm sai chính sách giá tối thiểu.
- Coupon cần kiểm tra lại trước khi tạo Order.

## Domain Event / Sự kiện domain

- `CouponCreated`
- `CouponApplied`
- `CouponRejected`
- `CouponExpired`
- `CouponUsageRecorded`

## Dependency / Phụ thuộc

- Core dependency: Promotion, Customer, Product
- Downstream: Cart, Order, Analytics

## Boundary / Ranh giới

Coupon không tự tạo campaign marketing. Promotion quản lý chiến dịch; Coupon chỉ quản lý mã và điều kiện áp dụng.

