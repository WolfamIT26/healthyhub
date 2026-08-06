# Promotion API Specification / Đặc tả API khuyến mãi

## API Overview / Tổng quan API

Promotion API quản lý chương trình khuyến mãi, campaign, lịch chạy, rule áp dụng và trạng thái hiển thị public/admin.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/promotions` | Danh sách promotion public | Public | Public |
| GET | `/api/v1/public/promotions/{promotionId}` | Chi tiết promotion public | Public | Public |
| GET | `/api/v1/admin/promotions` | Danh sách promotion admin | Manager/Admin JWT | `promotions:read` |
| POST | `/api/v1/admin/promotions` | Tạo promotion | Manager/Admin JWT | `promotions:manage` |
| GET | `/api/v1/admin/promotions/{promotionId}` | Chi tiết promotion admin | Manager/Admin JWT | `promotions:read` |
| PATCH | `/api/v1/admin/promotions/{promotionId}` | Cập nhật promotion | Manager/Admin JWT | `promotions:manage` |
| PATCH | `/api/v1/admin/promotions/{promotionId}/status` | Schedule/pause/end/archive | Manager/Admin JWT | `promotions:manage` |
| POST | `/api/v1/admin/promotions/{promotionId}/preview` | Preview rule áp dụng | Manager/Admin JWT | `promotions:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `promotions`.
- Action resources: `status`, `preview`.

## HTTP Method / Phương thức HTTP

- GET cho public/admin list/detail.
- POST cho create/preview.
- PATCH cho update/status.

## URI Convention / Quy ước URI

- Public namespace: `/api/v1/public/promotions`.
- Admin namespace: `/api/v1/admin/promotions`.
- ID parameter dùng `{promotionId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public xem promotion active/visible.
- Manager/Admin quản lý promotion.

## Authentication / Xác thực

- Public endpoint không cần JWT.
- Admin endpoint bắt buộc Manager/Admin JWT.

## Authorization / Phân quyền

- Draft/internal chỉ admin có quyền thấy.
- Status change cần `promotions:manage`.

## Request Contract / Contract request

- Create/update promotion dùng command input.
- Preview dùng action request với context giả lập an toàn.
- List dùng pagination/filter/search/sort.

## Response Contract / Contract response

- Public promotion summary/detail.
- Admin detail gồm condition summary, schedule, status, audit summary.
- Preview trả rule result, không ghi dữ liệu thật.

## Error Contract / Contract lỗi

- `BUSINESS.PROMOTION.INVALID_PERIOD`
- `BUSINESS.PROMOTION.CANNOT_EDIT_ACTIVE`
- `CONFLICT.PROMOTION.OVERLAPPING_RULE`

## Validation Rule / Quy tắc validation

- Period start/end hợp lệ.
- Rule áp dụng không mâu thuẫn.
- Promotion target phải tồn tại nếu tham chiếu product/category/customer segment.

## Business Rule / Quy tắc nghiệp vụ

- Promotion active có thể bị hạn chế sửa rule chính.
- Promotion public chỉ hiển thị trong thời gian và visibility hợp lệ.
- AI marketing content cần human review trước khi publish campaign.

## Pagination / Phân trang

- Public/admin list default 20.

## Filter / Lọc

- Lọc theo promotionStatus, startsAt, endsAt, targetType.

## Search / Tìm kiếm

- Search theo title, code/campaign name nếu có.

## Sort / Sắp xếp

- Public sort theo active priority và startsAt.
- Admin default `updatedAt` desc.

## Upload / Upload

Banner media đi qua Media API.

## Download / Download

Export promotion performance thuộc Analytics/Promotion future, không bắt buộc ở Prompt 10.

## Rate Limit / Giới hạn gọi API

- Public promotion: Public Normal.
- Admin preview/status: Strict.

## Idempotency / Chống gửi lặp

- Status action idempotent theo desired state.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI campaign assistant thuộc AI API. Promotion API chỉ nhận nội dung/rule đã duyệt.

