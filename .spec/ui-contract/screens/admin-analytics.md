# Admin Analytics Screen / Màn hình phân tích

## Screen Overview / Tổng quan màn hình

Admin Analytics hiển thị dashboard, sales, products, customers, inventory, marketing và AI usage metrics.

## Business Goal / Mục tiêu kinh doanh

Hỗ trợ ra quyết định bằng dữ liệu tổng hợp, không lộ raw data nhạy cảm mặc định.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/analytics` | Dashboard phân tích. |

## Permission / Phân quyền

Staff limited xem dashboard giới hạn; manager/admin xem report rộng hơn; export cần quyền.

## Required API / API bắt buộc

- `GET /api/v1/admin/analytics/dashboard`.
- `GET /api/v1/admin/analytics/sales`.
- `GET /api/v1/admin/analytics/products`.
- `GET /api/v1/admin/analytics/customers`.
- `GET /api/v1/admin/analytics/inventory`.
- `GET /api/v1/admin/analytics/marketing`.
- `GET /api/v1/admin/analytics/ai`.
- `POST /api/v1/admin/analytics/exports`.

## Required Data / Dữ liệu bắt buộc

Metric summary, chart dataset contract, date range, dimension, aggregation metadata, export job status.

## UI Sections / Khu vực UI

Date range filter, metric cards, chart/data sections, report tabs, export action, AI insight entry.

## Components / Thành phần

Metric Card, Chart Placeholder Contract, Date Range Filter, Report Table, Export Action.

## Form / Form

Date range/report filter form.

## Validation / Validation

Date range hợp lệ, metric/dimension whitelist, export format hợp lệ.

## Search / Tìm kiếm

Search trong report dimension nếu API hỗ trợ.

## Filter / Lọc

Date range, metricPeriod, productId, categoryId, campaignId, customer segment, channel.

## Sort / Sắp xếp

Sort theo metric value, date bucket, product name hoặc createdAt tùy report.

## Pagination / Phân trang

Dataset lớn dùng pagination; dashboard aggregate không cần.

## Upload / Upload

Không áp dụng.

## Download / Download

Export report qua export job và signed URL nếu private.

## Loading State / Trạng thái tải

Metric/chart/table skeleton.

## Empty State / Trạng thái rỗng

Không có dữ liệu trong period hoặc data not ready.

## Error State / Trạng thái lỗi

Invalid period, scope denied, data not ready, export failed.

## Success State / Trạng thái thành công

Metrics/report cập nhật, export job created.

## Confirmation Dialog / Hộp xác nhận

Export dữ liệu lớn/private cần xác nhận phạm vi.

## Toast Message / Toast

Export started/completed hoặc lỗi tải report.

## Skeleton / Skeleton

Metric cards, chart placeholder và table skeleton.

## Responsive Behavior / Hành vi responsive

Desktop nhiều panel; mobile dùng stacked cards và table compact.

## Accessibility / Khả năng tiếp cận

Chart phải có summary text/data table thay thế ở bước triển khai.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

