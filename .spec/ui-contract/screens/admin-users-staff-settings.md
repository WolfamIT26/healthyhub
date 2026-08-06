# Admin Users Staff Settings Screen / Màn hình user, nhân sự và cấu hình

## Screen Overview / Tổng quan màn hình

Màn hình này gom quản lý users, staff, role/permission, settings, feature flags và policy cấu hình cửa hàng.

## Business Goal / Mục tiêu kinh doanh

Đảm bảo quyền truy cập an toàn, cấu hình cửa hàng ổn định và chuẩn bị SaaS/multi-tenant.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/users` | Quản lý user/role/permission. |
| `/admin/staff` | Quản lý nhân sự. |
| `/admin/settings` | Quản lý settings. |

## Permission / Phân quyền

Admin/super admin; manager có thể xem hoặc chỉnh một phần nếu policy cho phép.

## Required API / API bắt buộc

- `GET /api/v1/admin/users`.
- `POST /api/v1/admin/users`.
- `PATCH /api/v1/admin/users/{userId}`.
- `PATCH /api/v1/admin/users/{userId}/status`.
- `PATCH /api/v1/admin/users/{userId}/roles`.
- `GET /api/v1/admin/roles`.
- `GET /api/v1/admin/permissions`.
- `GET /api/v1/admin/staff`.
- `POST /api/v1/admin/staff`.
- `PATCH /api/v1/admin/staff/{staffId}`.
- `PATCH /api/v1/admin/staff/{staffId}/status`.
- `PATCH /api/v1/admin/staff/{staffId}/roles`.
- `GET /api/v1/admin/settings`.
- `PATCH /api/v1/admin/settings/{settingId}`.
- `GET /api/v1/admin/settings/feature-flags`.
- `PATCH /api/v1/admin/settings/feature-flags/{flagKey}`.

## Required Data / Dữ liệu bắt buộc

User summary/detail, staff summary/detail, roles, permissions, settings, feature flags, security policy summary.

## UI Sections / Khu vực UI

User table, staff table, role/permission panel, settings list/form, feature flag panel, security summary.

## Components / Thành phần

Admin Table, Role Selector, Permission Summary, Staff Form, Setting Form, Feature Flag Toggle, Confirmation Dialog.

## Form / Form

User/staff create/update, role assignment, setting update, feature flag update.

## Validation / Validation

Email/phone format, role exists, cannot disable self/admin cuối cùng, setting value đúng type, reason required cho action nhạy cảm.

## Search / Tìm kiếm

Search user/staff theo tên, email masked, phone masked; settings theo key/label/group.

## Filter / Lọc

Role, status, createdAt, settingScope, group, visibility.

## Sort / Sắp xếp

User/staff default `createdAt` desc; settings theo group và key.

## Pagination / Phân trang

User/staff default 20, max 100; settings default 50.

## Upload / Upload

Không áp dụng trực tiếp.

## Download / Download

Export user/settings nếu có phải masking secret và cần quyền cao.

## Loading State / Trạng thái tải

Table/list skeleton, settings form disabled khi submit.

## Empty State / Trạng thái rỗng

Chưa có user/staff/settings hoặc không có kết quả theo filter.

## Error State / Trạng thái lỗi

Role denied, cannot disable self, admin required, invalid setting value, secret not exposed.

## Success State / Trạng thái thành công

User/staff/role/settings cập nhật thành công.

## Confirmation Dialog / Hộp xác nhận

Khóa user, đổi role, disable staff, đổi security setting hoặc feature flag production cần xác nhận.

## Toast Message / Toast

Cập nhật user/staff/role/setting thành công hoặc lỗi.

## Skeleton / Skeleton

Table rows, permission panel và settings form skeleton.

## Responsive Behavior / Hành vi responsive

Desktop dùng tab/table; mobile compact list và form full-screen.

## Accessibility / Khả năng tiếp cận

Role/permission thay đổi có mô tả, toggle có label text, secret masked có giải thích.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

