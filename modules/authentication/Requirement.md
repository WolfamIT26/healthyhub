# Requirement / Yêu cầu Authentication

## Functional Requirements / Yêu cầu chức năng

| ID | Yêu cầu | Actor | Kết quả |
| --- | --- | --- | --- |
| AUTH-F01 | Đăng ký bằng email, mật khẩu và tên | Guest | Tạo Customer account, khởi tạo xác minh email |
| AUTH-F02 | Đăng nhập bằng email và mật khẩu | Customer, Staff, Manager, Administrator | Customer chưa verify được tạo session/token; Internal phải verify trước login |
| AUTH-F03 | Làm mới access token | Session owner | Rotate refresh token và trả token metadata mới |
| AUTH-F04 | Đăng xuất | Authenticated user | Thu hồi session/refresh token hiện tại |
| AUTH-F05 | Yêu cầu và hoàn tất reset password | Guest | Account đã verify dùng token một lần; account chưa verify nhận hướng dẫn xác minh |
| AUTH-F06 | Xác minh/gửi lại xác minh email | Account/token owner | Email chuyển verified nếu token hợp lệ |
| AUTH-F07 | Lấy session hiện tại | Authenticated user | Trả actor, roles, permissions, token/session metadata |
| AUTH-F08 | Đổi mật khẩu | Authenticated account owner | Xác minh mật khẩu cũ, đổi và revoke theo policy |
| AUTH-F09 | Khóa/mở/vô hiệu hóa account | Administrator có `users:manage` | Cập nhật trạng thái và thu hồi session |
| AUTH-F10 | Cung cấp nền role/permission | Staff trở lên theo quyền | Backend enforce role và effective permission |

## Non-functional Requirements / Yêu cầu phi chức năng

- Mọi input được validate; endpoint nhạy cảm có rate limit, audit và log redaction theo approved `Security.md`.
- Password/token raw không xuất hiện trong database, log, tài liệu hay resource response.
- Lỗi login/forgot/reset dùng nội dung an toàn, hạn chế account enumeration.
- Authorization được enforce tại backend; frontend guard chỉ hỗ trợ trải nghiệm.
- Customer chưa verify được dùng session và capability không nhạy cảm; Checkout/Payment/Change Email/Change Password/Forgot-Reset/Delete/Recovery bắt buộc verified email qua policy dùng chung.
- Internal account (mọi role không phải Customer-only) bắt buộc verified email trước khi được cấp JWT/session.
- UI và thông báo người dùng bằng tiếng Việt, responsive và accessible.
- Không hard-code secret hoặc giá trị production.

## Out of Scope / Ngoài phạm vi

Google/Facebook/Apple, OTP, MFA, SSO, guest token, danh sách/quản trị session nhiều thiết bị và Super Admin platform operations.

## Traceability / Truy vết

Nguồn: feature/domain Authentication, API/authentication-flow, UI contracts, database logical/physical, OpenAPI và Implementation Foundation. Chi tiết chênh lệch nằm trong `Report.md`.
