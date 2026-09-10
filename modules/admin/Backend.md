# Admin Backend / Backend Admin

`AccessTokenGuard` verify JWT rồi recheck session owner/status/expiry, account status/deletion, current roles và `permissionsVersion` từ persistence. JWT role claim không còn là authorization authority hiện hành.

`AdminDashboardController` kết hợp `AccessTokenGuard`, `RolesGuard`, `PermissionsGuard`, `InternalRoles()` và `analytics:read`. `AdminDashboardService` cố định tenant đơn V1 phía server. `TypeOrmAdminDashboardRepository` chỉ aggregate domain tables canonical.

Admin Dashboard read không tạo durable audit noise. Prompt 35 Product mutations use current Internal authorization plus `products:manage` and emit safe structured audit log events through the existing logger.

Admin Product controllers do not hard-code role-only authority. Role metadata limits access to persisted Internal roles; permission guards resolve current `products:read`/`products:manage` from the Authentication/User permission model.
