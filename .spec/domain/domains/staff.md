# Staff Domain / Domain nhân sự vận hành

## Purpose / Mục đích

Quản lý vai trò vận hành của nhân sự cửa hàng như Staff, Manager và Administrator ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Xác định phạm vi thao tác của nhân sự.
- Phân biệt quyền xử lý đơn, tồn kho, sản phẩm và cấu hình.
- Hỗ trợ audit cho thao tác vận hành quan trọng.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `StaffProfile`
- Entity: `StaffAssignment`, `OperationalPermission`, `StaffActivity`
- Value Object: `StaffCode`, `WorkScope`, `AssignedRole`
- Enum: `StaffStatus`, `StaffRole`, `OperationalScope`

## Relationships / Quan hệ với domain khác

- Phụ thuộc User để nhận identity và role.
- Tác động Order, Inventory, Product, Customer khi xử lý vận hành.
- Settings quyết định policy quyền staff.

## Business Rule / Quy tắc nghiệp vụ

- Staff chỉ thao tác trong phạm vi được cấp.
- Manager có quyền vận hành cao hơn Staff.
- Admin quản lý cấu hình và user nội bộ.
- Super Admin chỉ dùng khi SaaS/multi-store được kích hoạt.

## Domain Event / Sự kiện domain

- `StaffAssigned`
- `StaffRoleChanged`
- `StaffDisabled`
- `StaffActionRecorded`

## Dependency / Phụ thuộc

- Core dependency: User, Settings
- Operational dependency: Order, Inventory, Product, Customer

## Boundary / Ranh giới

Staff không sở hữu dữ liệu đơn hàng hoặc tồn kho; domain này chỉ quản lý quyền và hồ sơ vận hành của nhân sự.

