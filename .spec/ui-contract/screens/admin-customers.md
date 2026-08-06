# Admin Customers Screen / Màn hình quản lý khách hàng

## Screen Overview / Tổng quan màn hình

Admin Customers cho staff/manager/admin xem hồ sơ khách, phân khúc, order summary, loyalty summary và hỗ trợ chăm sóc.

## Business Goal / Mục tiêu kinh doanh

Tăng chất lượng chăm sóc khách hàng, quản lý phân khúc và hỗ trợ vận hành đơn hàng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/customers` | Danh sách khách hàng. |
| `/admin/customers/:customerId` | Chi tiết khách hàng. |

## Permission / Phân quyền

Staff limited đọc theo scope; manager/admin quản lý phân khúc và note.

## Required API / API bắt buộc

- `GET /api/v1/admin/customers`.
- `GET /api/v1/admin/customers/{customerId}`.
- `PATCH /api/v1/admin/customers/{customerId}`.
- `PATCH /api/v1/admin/customers/{customerId}/segment`.
- `GET /api/v1/admin/loyalty/customers/{customerId}` nếu hiển thị loyalty.

## Required Data / Dữ liệu bắt buộc

Customer summary/detail, contact info masked theo quyền, segment, order summary, loyalty summary.

## UI Sections / Khu vực UI

Customer table, filter/search, detail profile, order summary, loyalty summary, segment action.

## Components / Thành phần

Admin Table, Customer Detail, Segment Selector, Summary Card, Reason Dialog, Toast.

## Form / Form

Customer admin update và segment update.

## Validation / Validation

Email/phone format nếu cập nhật, segment hợp lệ, reason nếu thay đổi nhạy cảm.

## Search / Tìm kiếm

Search theo tên, email masked, phone masked.

## Filter / Lọc

CustomerTier, customerStatus, createdAt, lastOrderAt.

## Sort / Sắp xếp

Default `createdAt` desc; sort theo lastOrderAt hoặc customerTier nếu API cho phép.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Không áp dụng.

## Download / Download

Export customer data chỉ khi có quyền và privacy policy.

## Loading State / Trạng thái tải

Table skeleton và detail skeleton.

## Empty State / Trạng thái rỗng

Không có customer hoặc không có kết quả theo filter.

## Error State / Trạng thái lỗi

Customer not found, scope denied, validation error.

## Success State / Trạng thái thành công

Customer/segment cập nhật thành công.

## Confirmation Dialog / Hộp xác nhận

Segment update nhạy cảm cần xác nhận nếu ảnh hưởng quyền lợi.

## Toast Message / Toast

Cập nhật customer/segment thành công hoặc lỗi.

## Skeleton / Skeleton

Customer rows và detail summary skeleton.

## Responsive Behavior / Hành vi responsive

Desktop table-detail; mobile compact list/detail full-screen.

## Accessibility / Khả năng tiếp cận

Thông tin masked có label, segment không chỉ biểu diễn bằng màu.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

