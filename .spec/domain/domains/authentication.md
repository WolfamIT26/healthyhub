# Authentication Domain / Domain xác thực

## Purpose / Mục đích

Xác định danh tính người dùng và kiểm soát trạng thái truy cập vào hệ thống.

## Responsibility / Trách nhiệm

- Quản lý luồng đăng ký, đăng nhập, đăng xuất và khôi phục truy cập.
- Kiểm tra trạng thái tài khoản trước khi cho truy cập.
- Ghi nhận sự kiện xác thực quan trọng ở mức nghiệp vụ.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `AuthenticationSession`
- Entity: `LoginAttempt`, `PasswordResetRequest`, `AccountVerification`
- Value Object: `Credential`, `VerificationToken`, `SessionContext`
- Enum: `AuthenticationStatus`, `LoginFailureReason`, `VerificationStatus`

## Relationships / Quan hệ với domain khác

- Phụ thuộc User để biết tài khoản, vai trò và trạng thái.
- Phát sinh Notification cho xác minh và khôi phục.
- Cung cấp danh tính cho Customer, Staff, Manager và Admin.

## Business Rule / Quy tắc nghiệp vụ

- Tài khoản bị khóa hoặc chưa hợp lệ không được đăng nhập.
- Đăng nhập thất bại nhiều lần phải bị giới hạn theo security guideline.
- Reset password phải có xác minh và thời hạn.

## Domain Event / Sự kiện domain

- `UserRegistered`
- `UserLoggedIn`
- `LoginFailed`
- `PasswordResetRequested`
- `AccountLocked`

## Dependency / Phụ thuộc

- Core dependency: User
- Supporting dependency: Notification, Settings

## Boundary / Ranh giới

Authentication không quản lý hồ sơ khách hàng, quyền chi tiết hoặc dữ liệu nhân sự. Domain này chỉ xác định danh tính và trạng thái truy cập.

