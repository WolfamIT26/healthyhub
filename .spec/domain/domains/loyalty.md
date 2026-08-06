# Loyalty Domain / Domain thành viên và điểm thưởng

## Purpose / Mục đích

Quản lý điểm thưởng, cấp bậc thành viên và quyền lợi Member/VIP.

## Responsibility / Trách nhiệm

- Tính điểm từ hành vi mua hợp lệ.
- Quản lý cấp bậc và tiêu chí VIP.
- Điều chỉnh điểm khi order bị hủy/hoàn.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `LoyaltyAccount`
- Entity: `LoyaltyTransaction`, `MembershipTier`, `VipQualification`
- Value Object: `LoyaltyPoint`, `TierRule`, `Benefit`
- Enum: `LoyaltyStatus`, `TierLevel`, `PointTransactionType`

## Relationships / Quan hệ với domain khác

- Loyalty phụ thuộc Customer và Order.
- Coupon/Promotion có thể cung cấp benefit cho tier.
- Analytics đọc Loyalty để đánh giá giữ chân khách.

## Business Rule / Quy tắc nghiệp vụ

- Điểm chỉ phát sinh từ hành vi hợp lệ.
- Hủy/hoàn order phải điều chỉnh điểm.
- VIP criteria phải rõ và audit được.
- Điều chỉnh thủ công cần lý do và quyền.

## Domain Event / Sự kiện domain

- `LoyaltyPointsEarned`
- `LoyaltyPointsAdjusted`
- `TierChanged`
- `VipQualified`

## Dependency / Phụ thuộc

- Core dependency: Customer, Order
- Supporting dependency: Coupon, Promotion, Analytics

## Boundary / Ranh giới

Loyalty không quyết định giá order trực tiếp. Coupon/Promotion xử lý ưu đãi; Loyalty cung cấp điều kiện và quyền lợi.

