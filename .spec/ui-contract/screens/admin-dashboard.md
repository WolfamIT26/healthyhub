# Admin Dashboard Screen / Màn hình dashboard quản trị

## Screen Overview / Tổng quan màn hình

Admin Dashboard hiển thị tổng quan vận hành: đơn hàng, doanh thu, tồn kho, cảnh báo, việc cần xử lý và metric cơ bản.

## Business Goal / Mục tiêu kinh doanh

Giúp staff/manager/admin phát hiện việc cần xử lý nhanh và đi đến đúng màn hình vận hành.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin` | Dashboard quản trị. |

## Permission / Phân quyền

Staff limited, manager, admin, super admin theo scope.

## Required API / API bắt buộc

- `GET /api/v1/admin/analytics/dashboard`.
- `GET /api/v1/admin/orders`.
- `GET /api/v1/admin/inventory/alerts`.
- `GET /api/v1/auth/session`.

## Required Data / Dữ liệu bắt buộc

Metric summary, alert list, pending orders, staff permission scope, dashboard dataset.

## UI Sections / Khu vực UI

Metric overview, pending order list, inventory alerts, quick actions, AI insight entry.

## Components / Thành phần

Admin Shell, Metric Card, Alert List, Task List, Quick Action, Permission-aware Navigation.

## Form / Form

Không có form chính; date range filter nếu API hỗ trợ.

## Validation / Validation

Date range hợp lệ nếu có filter.

## Search / Tìm kiếm

Không áp dụng trực tiếp; search nằm trong màn hình đích.

## Filter / Lọc

Date range, store/tenant scope tương lai nếu có.

## Sort / Sắp xếp

Pending tasks theo priority API trả về.

## Pagination / Phân trang

Không phân trang dashboard; mỗi block lấy số item giới hạn.

## Upload / Upload

Không áp dụng.

## Download / Download

Export report dẫn sang Admin Analytics nếu có quyền.

## Loading State / Trạng thái tải

Skeleton metric cards, alert rows và pending order rows.

## Empty State / Trạng thái rỗng

Không có cảnh báo hoặc đơn cần xử lý thì hiển thị trạng thái ổn định.

## Error State / Trạng thái lỗi

Nếu metric lỗi, hiển thị block error riêng; permission denied chuyển về login hoặc forbidden.

## Success State / Trạng thái thành công

Dashboard hiển thị metric và task theo quyền.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng trên dashboard.

## Toast Message / Toast

Không áp dụng thường xuyên.

## Skeleton / Skeleton

Skeleton giữ card và list dimensions.

## Responsive Behavior / Hành vi responsive

Desktop ưu tiên bảng/tổng quan nhiều cột; mobile dùng card stack và navigation rút gọn.

## Accessibility / Khả năng tiếp cận

Metric card có label text, alert không chỉ dựa vào màu.

## SEO Metadata / SEO metadata

Noindex vì là admin/private.

