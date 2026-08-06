# User Domain / Domain người dùng

## Purpose / Mục đích

Quản lý tài khoản hệ thống, vai trò và quyền truy cập ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Quản lý user nội bộ và user khách hàng ở mức identity.
- Gán vai trò như Customer, Staff, Manager, Administrator, Super Admin.
- Bảo vệ permission boundary cho hành động nhạy cảm.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `UserAccount`
- Entity: `RoleAssignment`, `PermissionGrant`, `UserStatusHistory`
- Value Object: `UserIdentity`, `RoleName`, `PermissionScope`
- Enum: `UserStatus`, `UserRole`, `PermissionLevel`

## Relationships / Quan hệ với domain khác

- Authentication dùng User để xác thực trạng thái.
- Customer và Staff mở rộng user theo ngữ cảnh nghiệp vụ.
- Settings quyết định policy quyền và cấu hình vai trò.

## Business Rule / Quy tắc nghiệp vụ

- User phải có trạng thái rõ.
- User nội bộ phải có vai trò trước khi thao tác quản trị.
- Không được vô hiệu hóa admin cuối cùng nếu làm mất khả năng quản trị.
- Thay đổi quyền quan trọng cần audit ở phase triển khai sau.

## Domain Event / Sự kiện domain

- `UserCreated`
- `RoleAssigned`
- `PermissionChanged`
- `UserDisabled`

## Dependency / Phụ thuộc

- Core dependency: Authentication, Settings
- Shared with: Customer, Staff, Notification

## Boundary / Ranh giới

User không lưu chi tiết đơn hàng, loyalty hoặc dữ liệu chăm sóc khách. Các domain đó chỉ tham chiếu UserIdentity khi cần.

