# Loyalty Screen / Màn hình điểm thưởng

## Screen Overview / Tổng quan màn hình

Loyalty screen hiển thị điểm, tier member/VIP và lịch sử giao dịch điểm.

## Business Goal / Mục tiêu kinh doanh

Tăng giữ chân khách hàng và minh bạch điểm thưởng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/account/loyalty` | Điểm thưởng của tôi. |

## Permission / Phân quyền

Member/VIP; customer chưa đủ điều kiện có thể thấy trạng thái hướng dẫn nếu business cho phép.

## Required API / API bắt buộc

- `GET /api/v1/me/loyalty/balance`.
- `GET /api/v1/me/loyalty/transactions`.

## Required Data / Dữ liệu bắt buộc

Point balance, customer tier, point transaction list, pagination metadata.

## UI Sections / Khu vực UI

Balance summary, tier summary, transaction list, earning rules summary nếu có.

## Components / Thành phần

Metric Summary, Tier Badge, Transaction List, Pagination, Empty State.

## Form / Form

Không áp dụng.

## Validation / Validation

Filter/page hợp lệ nếu có.

## Search / Tìm kiếm

Không ưu tiên ở customer view.

## Filter / Lọc

Lọc theo point status hoặc transaction type nếu API hỗ trợ.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Transaction list default 20, max 100.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton balance và transaction list.

## Empty State / Trạng thái rỗng

Chưa có giao dịch điểm, gợi ý mua hàng nếu phù hợp.

## Error State / Trạng thái lỗi

Owner required, loyalty unavailable hoặc session expired.

## Success State / Trạng thái thành công

Balance và transactions hiển thị đúng.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng ở customer view.

## Toast Message / Toast

Không áp dụng thường xuyên.

## Skeleton / Skeleton

Skeleton metric card và transaction rows.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên balance và tier trước, transaction list phía dưới.

## Accessibility / Khả năng tiếp cận

Point status hiển thị bằng text, tier badge có label.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.

