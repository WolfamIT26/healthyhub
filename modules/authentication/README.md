# Authentication Module / Module xác thực

## Purpose / Mục tiêu

Context Pack chuẩn hóa Authentication V1 để các bước database, shared contract, backend, frontend và test chỉ cần đọc thư mục này cùng các file đầu vào được chỉ rõ trong `ImplementationPlan.md`.

## Scope / Phạm vi

V1 gồm đăng ký bằng email/mật khẩu, đăng nhập, đăng xuất, access/refresh token, refresh rotation và revoke, quên/đặt lại/đổi mật khẩu, xác minh email, session hiện tại, nền role/permission và khóa/vô hiệu hóa tài khoản. Social login, OTP, MFA, SSO và quản lý nhiều thiết bị nâng cao nằm ngoài V1.

## Reading Order / Thứ tự đọc

1. `Requirement.md`, `UseCase.md`, `BusinessRules.md`.
2. `Security.md`, `Database.md`, `API.md`.
3. `Frontend.md`, `Backend.md`, `Testing.md`, `Acceptance.md`.
4. `Dependency.md`, `Decision.md`, `ImplementationPlan.md`, `Checklist.md`.
5. `Status.md`, `Report.md`, `TODO.md`, `ChangeLog.md`.

## Source Authority / Thẩm quyền nguồn

Business/feature specification quyết định phạm vi; database specification quyết định cấu trúc lưu trữ; API specification quyết định hành vi API; OpenAPI là contract máy đọc hiện tại. Mâu thuẫn không được tự sửa và được ghi trong `Report.md`/`Decision.md`.

## Current Gate / Cổng hiện tại

`Ready for Implementation`. Tất cả P0 đã Approved; authoritative specs và OpenAPI đã đồng bộ, nhưng code/migration/entity/UI chưa bắt đầu.
