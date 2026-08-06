# Settings Domain / Domain cấu hình

## Purpose / Mục đích

Quản lý cấu hình cửa hàng, quyền, thông báo, SEO, payment/shipping policy và SaaS readiness.

## Responsibility / Trách nhiệm

- Quản lý cấu hình nghiệp vụ quan trọng.
- Phân biệt cấu hình cửa hàng và cấu hình nền tảng tương lai.
- Kiểm soát thay đổi ảnh hưởng security, payment, shipping hoặc AI.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `StoreSettings`
- Entity: `SettingEntry`, `SettingChangeRequest`, `TenantSettingProfile`
- Value Object: `SettingKey`, `SettingValue`, `ConfigurationScope`
- Enum: `SettingStatus`, `ConfigurationArea`, `TenantMode`

## Relationships / Quan hệ với domain khác

- User/Staff dùng Settings để xác định policy quyền.
- Notification, Payment, Shipping và AI dùng Settings để biết rule cấu hình.
- Super Admin tương lai quản lý platform settings.

## Business Rule / Quy tắc nghiệp vụ

- Chỉ Admin hoặc vai trò được cấp quyền mới thay đổi cấu hình quan trọng.
- Thay đổi ảnh hưởng security/payment/shipping/AI cần audit.
- SaaS tương lai phải tách rõ tenant settings và platform settings.

## Domain Event / Sự kiện domain

- `SettingsChanged`
- `CriticalSettingsChangeRequested`
- `TenantSettingsPrepared`

## Dependency / Phụ thuộc

- Shared by: User, Staff, Notification, Payment, Shipping, AI

## Boundary / Ranh giới

Settings không triển khai logic của domain khác. Domain này chỉ cung cấp policy/cấu hình mà domain khác phải tuân thủ.

