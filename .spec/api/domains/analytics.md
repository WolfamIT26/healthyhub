# Analytics API Specification / Đặc tả API phân tích

## API Overview / Tổng quan API

Analytics API cung cấp dashboard, metric, report, conversion/event tracking và export dữ liệu tổng hợp. Domain này không sửa dữ liệu vận hành và không trả raw data nhạy cảm mặc định.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/admin/analytics/dashboard` | Dashboard tổng quan | Staff/Manager/Admin JWT | `analytics:read` |
| GET | `/api/v1/admin/analytics/sales` | Phân tích doanh thu/đơn hàng | Manager/Admin JWT | `analytics:read` |
| GET | `/api/v1/admin/analytics/products` | Phân tích sản phẩm | Manager/Admin JWT | `analytics:read` |
| GET | `/api/v1/admin/analytics/customers` | Phân tích khách hàng | Manager/Admin JWT | `analytics:read` |
| GET | `/api/v1/admin/analytics/inventory` | Phân tích tồn kho | Manager/Admin JWT | `analytics:read` |
| GET | `/api/v1/admin/analytics/marketing` | Phân tích campaign | Manager/Admin JWT | `analytics:read` |
| GET | `/api/v1/admin/analytics/ai` | Phân tích AI usage/quality | Admin JWT | `analytics:read` |
| POST | `/api/v1/admin/analytics/exports` | Tạo export report | Manager/Admin JWT | `analytics:export` |
| POST | `/api/v1/analytics/events` | Ghi event tracking public/client | Public hoặc JWT | Event scope |

## REST Resource / Tài nguyên REST

- Primary resource: `analytics`.
- Sub resources: `dashboard`, `sales`, `products`, `customers`, `inventory`, `marketing`, `ai`, `exports`, `events`.

## HTTP Method / Phương thức HTTP

- GET cho dashboard/metric.
- POST cho export job và event tracking.

## URI Convention / Quy ước URI

- Admin namespace: `/api/v1/admin/analytics`.
- Event tracking namespace: `/api/v1/analytics/events`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Staff limited có thể xem dashboard giới hạn.
- Manager/Admin xem analytics rộng hơn.
- Export cần `analytics:export`.

## Authentication / Xác thực

- Admin analytics bắt buộc Staff JWT trở lên.
- Event tracking có thể public hoặc JWT tùy event.

## Authorization / Phân quyền

- Data scope theo role, tenant/store và permission.
- Customer-level raw data không trả mặc định.
- AI analytics có thể yêu cầu admin permission.

## Request Contract / Contract request

- Metric query dùng filter period, date range, dimensions và aggregation.
- Export dùng export contract.
- Event tracking dùng event input đã validate và không chứa PII không cần thiết.

## Response Contract / Contract response

- Metric summary, dashboard dataset, chart dataset và export job status.
- Response có data period, timezone, aggregation metadata và data readiness flag nếu cần.

## Error Contract / Contract lỗi

- `VALIDATION.ANALYTICS.INVALID_PERIOD`
- `PERMISSION.ANALYTICS.SCOPE_DENIED`
- `SYSTEM.ANALYTICS.DATA_NOT_READY`
- `RATE_LIMIT.COMMON.TOO_MANY_REQUESTS`

## Validation Rule / Quy tắc validation

- Date range hợp lệ và không quá giới hạn.
- Metric/dimension nằm trong whitelist.
- Export format hợp lệ.
- Event name và payload nằm trong tracking schema được duyệt.

## Business Rule / Quy tắc nghiệp vụ

- Analytics chỉ đọc/tổng hợp dữ liệu.
- Dữ liệu nhạy cảm ưu tiên aggregate/masking.
- Report lớn chạy bất đồng bộ.

## Pagination / Phân trang

- Dataset lớn dùng pagination hoặc cursor.
- Dashboard aggregate thường không phân trang.

## Filter / Lọc

- Lọc theo date range, metricPeriod, productId, categoryId, campaignId, customer segment và channel nếu có quyền.

## Search / Tìm kiếm

- Search trong report dimension như product name, campaign name nếu endpoint hỗ trợ.

## Sort / Sắp xếp

- Sort theo metric value, date bucket, product name hoặc createdAt tùy report.

## Upload / Upload

Không áp dụng.

## Download / Download

- Export report dùng export contract, signed URL nếu private.

## Rate Limit / Giới hạn gọi API

- Dashboard/metric: Authenticated Normal.
- Export/event tracking: Cost Strict hoặc Public Normal theo loại.

## Idempotency / Chống gửi lặp

- Export job cần idempotency key.
- Event tracking cần dedupe nếu client có eventId.

## Webhook / Webhook

Không áp dụng trong Prompt 10. Integration analytics provider nếu có sẽ qua Integration Gateway.

## AI Endpoint / Endpoint AI

AI analytics insight nằm ở AI API nhưng có thể dùng Analytics dataset theo quyền.

