# Customer Order Detail Screen / Màn hình chi tiết đơn hàng của tôi

## Screen Overview / Tổng quan màn hình

Màn hình chi tiết đơn cho customer xem trạng thái, sản phẩm, thanh toán, giao hàng và action hủy/review nếu đủ điều kiện.

## Business Goal / Mục tiêu kinh doanh

Tăng minh bạch trạng thái đơn, giảm hỗ trợ thủ công và khuyến khích review sau mua.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/orders/:orderId` | Chi tiết đơn của tôi. |

## Permission / Phân quyền

Customer/member/VIP, owner only.

## Required API / API bắt buộc

- `GET /api/v1/me/orders/{orderId}`.

Trong Customer Orders V1, endpoint detail trả Order item/address snapshot cùng Payment/Shipping summary cần thiết. Cancel, tracking riêng và các action khác vẫn là future scope, không được suy diễn từ màn hình đọc.

## Required Data / Dữ liệu bắt buộc

Order detail, item snapshots, totals, order timeline, payment summary, shipping/tracking summary.

## UI Sections / Khu vực UI

Order header, status timeline, item snapshot, payment section, shipping section, total summary, actions.

## Components / Thành phần

Status Timeline, Order Item, Price Summary, Payment Status, Shipping Tracking, Confirmation Dialog.

## Form / Form

Cancel reason nếu customer hủy đơn và API yêu cầu.

## Validation / Validation

OrderId hợp lệ, cancel reason required nếu rule yêu cầu, status đủ điều kiện hủy.

## Search / Tìm kiếm

Không áp dụng.

## Filter / Lọc

Không áp dụng.

## Sort / Sắp xếp

Timeline theo thời gian tăng dần hoặc API trả về.

## Pagination / Phân trang

Không áp dụng.

## Upload / Upload

Không áp dụng.

## Download / Download

Invoice/download là future enhancement nếu API bổ sung.

## Loading State / Trạng thái tải

Skeleton detail header, timeline và item list.

## Empty State / Trạng thái rỗng

Không áp dụng; not found nếu không có đơn.

## Error State / Trạng thái lỗi

Order not found, owner required, cannot cancel hoặc tracking/payment load failed.

## Success State / Trạng thái thành công

Cancel thành công cập nhật order status và timeline.

## Confirmation Dialog / Hộp xác nhận

Xác nhận hủy đơn.

## Toast Message / Toast

Hủy đơn thành công hoặc lỗi không thể hủy.

## Skeleton / Skeleton

Skeleton giữ vùng timeline, item list và summary.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên status, items và actions; desktop có thể chia detail và summary.

## Accessibility / Khả năng tiếp cận

Timeline có text status, action hủy có mô tả rõ hậu quả.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.
