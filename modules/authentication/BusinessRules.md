# Business Rules / Quy tắc nghiệp vụ

| ID | Quy tắc |
| --- | --- |
| BR-AUTH-01 | Guest chỉ tự đăng ký Customer; không tự chọn role đặc quyền. |
| BR-AUTH-02 | Email là định danh V1 duy nhất, trim/lowercase và globally unique trong single-tenant V1. |
| BR-AUTH-03 | Account locked, disabled hoặc không hợp lệ không được tạo/refresh session. |
| BR-AUTH-04 | Account chưa verified không được login hoặc refresh; public error vẫn generic. |
| BR-AUTH-05 | Credential sai trả lỗi generic; không phân biệt email không tồn tại và password sai. |
| BR-AUTH-06 | Forgot password luôn trả cùng kết quả an toàn bất kể account tồn tại. |
| BR-AUTH-07 | Reset/verification token có hạn, dùng một lần và chỉ lưu dạng hash/reference. |
| BR-AUTH-08 | Refresh chỉ hợp lệ cho session active, đúng owner, chưa hết hạn/revoke; phải rotation theo V1 target. |
| BR-AUTH-09 | Logout idempotent: session đã revoke vẫn cho kết quả an toàn. |
| BR-AUTH-10 | Reset thu hồi toàn bộ session; change password thu hồi session khác và rotate session hiện tại. |
| BR-AUTH-11 | Effective permission được tính ở backend; role không thay thế permission check cho action nhạy cảm. |
| BR-AUTH-12 | Khóa/disable account thuộc User domain API, yêu cầu Administrator và `users:manage`, đồng thời revoke session. |
| BR-AUTH-13 | Super Admin dành cho platform scope tương lai, không có public registration hay V1 operation riêng. |
| BR-AUTH-14 | Các thay đổi credential, account status, role/permission và revoke phải audit. |

## Actor & Permission Mapping / Ánh xạ actor và quyền

| Actor | Authentication V1 | Endpoint class |
| --- | --- | --- |
| Guest | Register, login, forgot/reset, verify/resend | Public hoặc token-owner |
| Customer | Session, refresh, logout, change password; quyền nghiệp vụ theo scope | Authenticated/owner |
| Staff | Như authenticated user; vào admin area khi có permission | Role- và permission-protected |
| Manager | Như Staff, permission quản lý do User domain cấp | Role- và permission-protected |
| Administrator | Quản lý status/role/permission theo `users:*` | Admin-only và permission-protected |
| Super Admin | Không có V1 operation riêng | Reserved; không suy diễn quyền vượt tenant |

`Administrator` là tên chuẩn trong tài liệu module; `Admin` trong nguồn/OpenAPI được hiểu là alias cần chuẩn hóa sau.
