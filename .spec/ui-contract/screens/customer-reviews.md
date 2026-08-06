# Customer Reviews Screen / Màn hình đánh giá của tôi

## Screen Overview / Tổng quan màn hình

Customer Reviews cho customer xem, tạo, sửa hoặc ẩn review của mình.

## Business Goal / Mục tiêu kinh doanh

Khuyến khích feedback sau mua và giúp review public có chất lượng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/account/reviews` | Review của tôi. |

## Permission / Phân quyền

Customer/member/VIP, owner only.

## Required API / API bắt buộc

- `GET /api/v1/me/reviews`.
- `POST /api/v1/me/reviews`.
- `PATCH /api/v1/me/reviews/{reviewId}`.
- `DELETE /api/v1/me/reviews/{reviewId}`.

## Required Data / Dữ liệu bắt buộc

Review list/detail, product summary, rating, content, reviewStatus, validation response.

## UI Sections / Khu vực UI

Review list, review form, product reference, moderation status.

## Components / Thành phần

Review Card, Rating Input, Textarea, Status Badge, Confirmation Dialog, Toast.

## Form / Form

Rating và nội dung review, product/order reference nếu tạo từ order detail.

## Validation / Validation

Rating required/range, content length, purchase required, already reviewed.

## Search / Tìm kiếm

Không ưu tiên; có thể search theo product nếu API hỗ trợ.

## Filter / Lọc

Lọc theo reviewStatus hoặc rating nếu API hỗ trợ.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20.

## Upload / Upload

Review media nếu có sau này đi qua Media API, chưa bắt buộc.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton review list và disabled form khi submit.

## Empty State / Trạng thái rỗng

Chưa có review, gợi ý xem đơn đã hoàn tất.

## Error State / Trạng thái lỗi

Purchase required, already reviewed, owner required hoặc validation error.

## Success State / Trạng thái thành công

Review tạo/sửa/xóa thành công, status cập nhật.

## Confirmation Dialog / Hộp xác nhận

Xác nhận xóa/ẩn review.

## Toast Message / Toast

Review đã gửi, đã cập nhật, đã xóa hoặc lỗi.

## Skeleton / Skeleton

Skeleton review cards.

## Responsive Behavior / Hành vi responsive

Mobile form và list một cột.

## Accessibility / Khả năng tiếp cận

Rating input có label bằng text, không chỉ dùng sao/màu.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.

