# Admin Payment Shipping Screen / Màn hình thanh toán và giao hàng

## Screen Overview / Tổng quan màn hình

Màn hình này giúp admin/staff theo dõi payment, refund, shipping, tracking và trạng thái provider.

## Business Goal / Mục tiêu kinh doanh

Giảm lỗi xử lý thanh toán/giao hàng và giúp đối soát vận hành rõ ràng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/operations` | Tổng hợp payment/shipping. |
| `/admin/payments` | Quản lý thanh toán nếu tách route. |
| `/admin/shipments` | Quản lý giao hàng nếu tách route. |

## Permission / Phân quyền

Staff đọc; manager/admin refund hoặc cập nhật trạng thái giao hàng.

## Required API / API bắt buộc

- `GET /api/v1/admin/payments`.
- `GET /api/v1/admin/payments/{paymentId}`.
- `POST /api/v1/admin/payments/{paymentId}/refunds`.
- `GET /api/v1/admin/payments/{paymentId}/transactions`.
- `GET /api/v1/admin/shipments`.
- `GET /api/v1/admin/shipments/{shipmentId}`.
- `PATCH /api/v1/admin/shipments/{shipmentId}/status`.
- `POST /api/v1/admin/shipments/{shipmentId}/tracking-events`.

## Required Data / Dữ liệu bắt buộc

Payment summary/detail, refund summary, transaction list, shipment summary/detail, tracking events, masked address/phone.

## UI Sections / Khu vực UI

Payment table, shipment table, detail panel, refund form, tracking timeline, provider status summary.

## Components / Thành phần

Admin Table, Status Badge, Transaction List, Refund Form, Tracking Timeline, Reason Dialog.

## Form / Form

Refund form và shipping status/tracking form.

## Validation / Validation

Refund amount hợp lệ, reason required, shipment status transition hợp lệ, tracking reference hợp lệ.

## Search / Tìm kiếm

Search theo order code, payment reference an toàn, tracking reference, recipient phone masked.

## Filter / Lọc

PaymentStatus, shippingStatus, provider, method, carrier, createdAt, deliveredAt.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Payment/shipment list default 20, max 100.

## Upload / Upload

Không áp dụng.

## Download / Download

Export payment/shipping report nếu có quyền.

## Loading State / Trạng thái tải

Table/detail skeleton và action loading.

## Empty State / Trạng thái rỗng

Không có payment/shipment hoặc không có kết quả theo filter.

## Error State / Trạng thái lỗi

Provider error, invalid status, refund denied, permission denied.

## Success State / Trạng thái thành công

Refund/status/tracking cập nhật thành công.

## Confirmation Dialog / Hộp xác nhận

Refund và status delivery quan trọng cần xác nhận.

## Toast Message / Toast

Refund/status/tracking thành công hoặc lỗi provider.

## Skeleton / Skeleton

Table rows, detail panel và timeline skeleton.

## Responsive Behavior / Hành vi responsive

Desktop dùng tabs/tables; mobile dùng list compact và detail full-screen.

## Accessibility / Khả năng tiếp cận

Payment/shipping status có text, refund form có label và cảnh báo hậu quả.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

