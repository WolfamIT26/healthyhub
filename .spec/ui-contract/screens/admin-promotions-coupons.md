# Admin Promotions Coupons Screen / Màn hình khuyến mãi và coupon

## Screen Overview / Tổng quan màn hình

Màn hình quản lý coupon, promotion, campaign schedule, rule preview và trạng thái ưu đãi.

## Business Goal / Mục tiêu kinh doanh

Tạo ưu đãi có kiểm soát, tránh rule mâu thuẫn và hỗ trợ chiến dịch bán hàng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/promotions` | Quản lý promotion. |
| `/admin/coupons` | Quản lý coupon nếu tách route. |

## Permission / Phân quyền

Manager/admin.

## Required API / API bắt buộc

- `GET /api/v1/admin/promotions`.
- `POST /api/v1/admin/promotions`.
- `PATCH /api/v1/admin/promotions/{promotionId}`.
- `PATCH /api/v1/admin/promotions/{promotionId}/status`.
- `POST /api/v1/admin/promotions/{promotionId}/preview`.
- `GET /api/v1/admin/coupons`.
- `POST /api/v1/admin/coupons`.
- `PATCH /api/v1/admin/coupons/{couponId}`.
- `PATCH /api/v1/admin/coupons/{couponId}/status`.
- `GET /api/v1/admin/coupons/{couponId}/usage`.

## Required Data / Dữ liệu bắt buộc

Promotion/coupon list/detail, condition summary, schedule, discount, usage, preview result, status.

## UI Sections / Khu vực UI

Promotion table, coupon table, form panel, rule preview, usage summary, status action.

## Components / Thành phần

Admin Table, Promotion Form, Coupon Form, Rule Preview, Usage Summary, Status Badge, Confirmation Dialog.

## Form / Form

Promotion/coupon create/update gồm title/code, discount, period, condition, target và visibility.

## Validation / Validation

Valid period, discount amount/rate, unique code, non-conflicting condition, target exists.

## Search / Tìm kiếm

Search theo title, campaign name, coupon code.

## Filter / Lọc

Status, discountType, startsAt, endsAt, targetType.

## Sort / Sắp xếp

Default `updatedAt` desc.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Banner media đi qua Admin Media, màn hình chỉ attach nếu cần.

## Download / Download

Export coupon usage hoặc promotion performance nếu có quyền.

## Loading State / Trạng thái tải

Table skeleton, preview loading, form submit loading.

## Empty State / Trạng thái rỗng

Chưa có promotion/coupon, hiển thị tạo mới nếu có quyền.

## Error State / Trạng thái lỗi

Expired, usage limit, overlapping rule, cannot edit active, validation error.

## Success State / Trạng thái thành công

Promotion/coupon lưu, preview hoặc status cập nhật thành công.

## Confirmation Dialog / Hộp xác nhận

Activate/pause/archive/end promotion hoặc coupon cần xác nhận.

## Toast Message / Toast

Lưu, preview, status và export thành công/lỗi.

## Skeleton / Skeleton

Table rows và form panel skeleton.

## Responsive Behavior / Hành vi responsive

Desktop dùng tabs/tables; mobile dùng list và form full-screen.

## Accessibility / Khả năng tiếp cận

Discount/rule labels rõ, status có text, action campaign có mô tả.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

