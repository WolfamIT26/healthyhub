# Admin Backend / Backend Admin

`AccessTokenGuard` verify JWT rồi recheck session owner/status/expiry, account status/deletion, current roles và `permissionsVersion` từ persistence. JWT role claim không còn là authorization authority hiện hành.

`AdminDashboardController` kết hợp `AccessTokenGuard`, `RolesGuard`, `PermissionsGuard`, `InternalRoles()` và `analytics:read`. `AdminDashboardService` cố định tenant đơn V1 phía server. `TypeOrmAdminDashboardRepository` chỉ aggregate domain tables canonical.

Admin read không tạo durable audit noise; Prompt 34 không có privileged mutation.
