# User API Specification / Đặc tả API người dùng và phân quyền

## API Overview / Tổng quan API

User API quản lý user account, role, permission và trạng thái truy cập admin/customer ở mức quản trị. Domain này không xử lý login trực tiếp, login thuộc Authentication API.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/admin/users` | Danh sách user | Staff JWT | `users:read` |
| POST | `/api/v1/admin/users` | Tạo user nội bộ | Admin JWT | `users:manage` |
| GET | `/api/v1/admin/users/{userId}` | Chi tiết user | Staff JWT | `users:read` |
| PATCH | `/api/v1/admin/users/{userId}` | Cập nhật user | Admin JWT | `users:manage` |
| PATCH | `/api/v1/admin/users/{userId}/status` | Khóa/mở/disable user | Admin JWT | `users:manage` |
| GET | `/api/v1/admin/users/{userId}/permissions` | Xem effective permissions | Admin JWT | `users:read` |
| PATCH | `/api/v1/admin/users/{userId}/roles` | Gán role cho user | Admin JWT | `users:manage` |
| GET | `/api/v1/admin/roles` | Danh sách role | Staff JWT | `users:read` |
| GET | `/api/v1/admin/permissions` | Danh sách permission | Admin JWT | `users:read` |

## REST Resource / Tài nguyên REST

- Primary resources: `users`, `roles`, `permissions`.
- Action resource: `status`, `roles`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail.
- POST cho tạo user.
- PATCH cho cập nhật hoặc đổi trạng thái.

## URI Convention / Quy ước URI

- Admin namespace: `/api/v1/admin/users`.
- ID parameter dùng `{userId}`.
- Không dùng endpoint public để tra user.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Staff có thể đọc theo phạm vi nếu được cấp.
- Admin quản lý user và role.
- Super Admin quản lý platform/multi-tenant sau này.

## Authentication / Xác thực

- Bắt buộc Staff JWT hoặc Admin JWT theo endpoint.

## Authorization / Phân quyền

- Không cho staff tự nâng quyền.
- Không cho admin thường thay đổi Super Admin nếu SaaS scope chưa cho phép.
- Hành động đổi role/status phải audit.

## Request Contract / Contract request

- List query request dùng pagination, filter, search và sort.
- Create/update user dùng command input, không nhận password hash.
- Role assignment dùng action request và cần reason nếu thay đổi quyền nhạy cảm.

## Response Contract / Contract response

- User list item trả summary, status, role summary và audit timestamp cần thiết.
- User detail trả permission summary theo quyền.
- Không trả password hash, token raw hoặc security secret.

## Error Contract / Contract lỗi

- `NOT_FOUND.USER.USER_NOT_FOUND`
- `CONFLICT.USER.EMAIL_EXISTS`
- `PERMISSION.USER.ROLE_DENIED`
- `CONFLICT.COMMON.VERSION_CONFLICT`

## Validation Rule / Quy tắc validation

- Email/phone đúng format.
- Role ID phải tồn tại và actor được phép gán.
- Status transition phải hợp lệ.
- Update nên dùng `version` nếu có optimistic locking.

## Business Rule / Quy tắc nghiệp vụ

- Không được tự khóa tài khoản admin hiện tại nếu làm mất quyền truy cập hệ thống.
- User bị khóa không được đăng nhập hoặc refresh token.
- Permission effective tính từ role và policy, không nhận trực tiếp từ client.

## Pagination / Phân trang

- `GET /api/v1/admin/users` dùng page pagination, default 20, max 100.

## Filter / Lọc

- Cho phép lọc theo `userStatus`, `role`, `createdAt`, `updatedAt`.

## Search / Tìm kiếm

- Search theo tên, email masked, phone masked hoặc user code nếu có.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.
- Cho phép sort theo `createdAt`, `updatedAt`, `displayName`, `userStatus`.

## Upload / Upload

Không áp dụng trực tiếp. Avatar nếu có đi qua Media API.

## Download / Download

Export user list nếu cần thuộc admin export policy sau này, chưa là MVP endpoint.

## Rate Limit / Giới hạn gọi API

- Admin management dùng Authenticated Normal.
- Role/status change dùng Strict.

## Idempotency / Chống gửi lặp

- Role/status action nên idempotent theo desired state.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

Không áp dụng trực tiếp. AI không được đọc dữ liệu user nhạy cảm nếu không có permission scope.

