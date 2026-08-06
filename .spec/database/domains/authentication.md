# Authentication Database / Database domain xác thực

## Storage Purpose / Mục đích lưu trữ

Lưu phiên đăng nhập, lần thử đăng nhập, yêu cầu reset password và xác minh tài khoản để kiểm soát truy cập và audit bảo mật.

## Entity List / Danh sách Entity

| Logical Entity / Entity logic | Purpose / Vai trò |
| --- | --- |
| `authentication_sessions` | Lưu phiên truy cập logic của user. |
| `login_attempts` | Ghi nhận lần thử đăng nhập thành công/thất bại. |
| `password_reset_requests` | Lưu yêu cầu đặt lại mật khẩu có thời hạn. |
| `account_verifications` | Lưu trạng thái xác minh email/phone/account. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status / Trạng thái |
| --- | --- | --- | --- | --- |
| `authentication_sessions` | `id` | `tenant_id`, `session_status`, `session_context`, `issued_at`, `expires_at`, `revoked_at` | `user_account_id` -> User | active, expired, revoked |
| `login_attempts` | `id` | `tenant_id`, `identifier`, `attempt_status`, `failure_reason`, `ip_address`, `attempted_at` | `user_account_id` -> User nullable | success, failed, blocked |
| `password_reset_requests` | `id` | `tenant_id`, `request_status`, `token_reference`, `requested_at`, `expires_at`, `used_at` | `user_account_id` -> User | requested, used, expired, cancelled |
| `account_verifications` | `id` | `tenant_id`, `verification_type`, `verification_status`, `token_reference`, `expires_at`, `verified_at` | `user_account_id` -> User | pending, verified, expired, rejected |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Không có quan hệ 1-1 bắt buộc trong domain này.
- 1-N: Một `user_account` có nhiều `authentication_sessions`, `login_attempts`, `password_reset_requests` và `account_verifications`.
- N-N: Không có quan hệ N-N trực tiếp.
- Cardinality: `login_attempts.user_account_id` có thể rỗng khi identifier chưa map được với user.

## Business Constraints / Ràng buộc nghiệp vụ

- User bị khóa hoặc chưa hợp lệ không được tạo session active.
- Reset password và verification phải có thời hạn.
- Login failed nhiều lần phải đủ dữ liệu để phục vụ rate limit và security audit.

## Delete Strategy / Chiến lược xóa

- `authentication_sessions`: soft revoke bằng `revoked_at`, không hard delete trong audit window.
- `login_attempts`: hard delete chỉ sau thời gian lưu log bảo mật theo policy.
- `password_reset_requests` và `account_verifications`: không xóa trong khi còn hiệu lực; có thể purge sau khi hết hạn và đã qua retention.

## Audit Fields / Trường audit

Áp dụng `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `version`. Với login attempt cần thêm `ip_address` và `user_agent` ở mức logical.

## Data Lifecycle / Vòng đời dữ liệu

Phiên được tạo khi đăng nhập, hết hạn theo policy hoặc bị revoke khi logout/khóa tài khoản. Reset và verification chuyển từ pending sang used/verified/expired theo thời gian hoặc hành động user.

## Data Ownership / Sở hữu dữ liệu

Authentication sở hữu session và token reference. User sở hữu hồ sơ tài khoản, role và trạng thái user.

## Data Validation / Validation dữ liệu

- `expires_at` phải sau `issued_at` hoặc `requested_at`.
- `token_reference` không lưu token raw dạng đọc được.
- `session_status` và `verification_status` dùng enum chuẩn.

## Data Dictionary / Từ điển dữ liệu

| Field / Trường | Entity | Meaning / Ý nghĩa | Validation / Kiểm tra |
| --- | --- | --- | --- |
| `user_account_id` | All | Tham chiếu user được xác thực. | Có thể nullable ở login attempt. |
| `session_status` | `authentication_sessions` | Trạng thái phiên. | Thuộc enum AuthenticationStatus. |
| `failure_reason` | `login_attempts` | Lý do thất bại. | Thuộc enum LoginFailureReason. |
| `token_reference` | Reset/verification | Dấu vết token đã băm hoặc reference an toàn. | Không lưu raw secret. |
| `expires_at` | Session/reset/verification | Thời điểm hết hiệu lực. | Bắt buộc với token và session. |
