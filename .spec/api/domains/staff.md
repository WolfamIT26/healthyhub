# Staff API Specification / Đặc tả API nhân sự

## API Overview / Tổng quan API

Staff API quản lý nhân sự vận hành cửa hàng, trạng thái làm việc, vai trò và phạm vi truy cập admin. Domain này phục vụ Manager, Administrator và Super Admin tương lai.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/admin/staff` | Danh sách nhân sự | Admin JWT | `staff:read` |
| POST | `/api/v1/admin/staff` | Tạo nhân sự | Admin JWT | `staff:manage` |
| GET | `/api/v1/admin/staff/{staffId}` | Chi tiết nhân sự | Admin JWT | `staff:read` |
| PATCH | `/api/v1/admin/staff/{staffId}` | Cập nhật nhân sự | Admin JWT | `staff:manage` |
| PATCH | `/api/v1/admin/staff/{staffId}/status` | Đổi trạng thái nhân sự | Admin JWT | `staff:manage` |
| PATCH | `/api/v1/admin/staff/{staffId}/roles` | Gán role/phạm vi | Admin JWT | `staff:manage` |
| GET | `/api/v1/admin/staff/{staffId}/activity-summary` | Tóm tắt hoạt động | Manager/Admin JWT | `staff:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `staff`.
- Action resources: `status`, `roles`, `activity-summary`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail/activity.
- POST tạo staff.
- PATCH cập nhật hoặc đổi trạng thái/role.

## URI Convention / Quy ước URI

- Admin namespace: `/api/v1/admin/staff`.
- ID parameter dùng `{staffId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- `staff:read` để xem.
- `staff:manage` để tạo/sửa/đổi role/status.
- Super Admin scope dành cho SaaS tương lai.

## Authentication / Xác thực

- Bắt buộc Admin JWT hoặc Manager/Admin JWT theo endpoint.

## Authorization / Phân quyền

- Không cho staff tự nâng quyền.
- Không disable chính mình nếu làm mất admin cuối cùng.
- Role assignment phải kiểm tra role hierarchy.

## Request Contract / Contract request

- Staff create/update dùng command input.
- Status/role action cần reason.
- Không nhận password hash hoặc permission effective từ client.

## Response Contract / Contract response

- Staff summary/detail trả profile vận hành, role summary, status và audit summary.
- Activity summary chỉ trả aggregate, không trả log nhạy cảm nếu không có quyền.

## Error Contract / Contract lỗi

- `NOT_FOUND.STAFF.STAFF_NOT_FOUND`
- `BUSINESS.STAFF.CANNOT_DISABLE_SELF`
- `PERMISSION.STAFF.ADMIN_REQUIRED`
- `PERMISSION.USER.ROLE_DENIED`

## Validation Rule / Quy tắc validation

- Email/phone đúng format.
- Role ID hợp lệ.
- Work status hợp lệ.
- Reason bắt buộc với status/role change.

## Business Rule / Quy tắc nghiệp vụ

- Staff là user có phạm vi vận hành.
- Admin cuối cùng không được bị khóa/xóa nếu chưa có người thay thế.
- Thay đổi quyền phải audit.

## Pagination / Phân trang

- Staff list dùng page pagination default 20, max 100.

## Filter / Lọc

- Lọc theo role, status, createdAt, updatedAt.

## Search / Tìm kiếm

- Search theo tên, email masked, phone masked.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.
- Cho phép sort theo `displayName`, `createdAt`, `updatedAt`, `staffStatus`.

## Upload / Upload

Không áp dụng trực tiếp.

## Download / Download

Không áp dụng trong Prompt 10.

## Rate Limit / Giới hạn gọi API

- Staff management: Authenticated Normal.
- Role/status change: Strict.

## Idempotency / Chống gửi lặp

- Status/role action nên idempotent theo desired state.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

Không áp dụng.

