# API Security / Bảo mật API

## Purpose / Mục tiêu

Tài liệu này định nghĩa authentication, authorization, JWT, refresh token, permission, role, API key, CORS và rate limiting cho API Specification của HealthyHub.

## Security Principle / Nguyên tắc bảo mật

- Backend kiểm tra quyền cho mọi endpoint, UI chỉ hỗ trợ ẩn/hiện chức năng.
- Không trả dữ liệu nhạy cảm trong response hoặc error.
- Mọi action nhạy cảm phải có audit log ở bước triển khai sau.
- AI endpoint phải tuân thủ quyền dữ liệu và safety policy.
- Webhook phải xác thực chữ ký hoặc API key/provider secret khi triển khai.

## Authentication / Xác thực

| Type / Loại | Usage / Cách dùng |
| --- | --- |
| Public | Không cần đăng nhập, chỉ trả dữ liệu public. |
| Optional JWT | Có thể cá nhân hóa nếu đăng nhập, vẫn hoạt động khi guest. |
| Customer JWT | Customer/member/VIP dùng cho dữ liệu cá nhân. |
| Staff JWT | Staff/manager/admin/super admin dùng cho admin API. |
| API Key | Chỉ dùng cho integration nội bộ hoặc provider webhook nếu cần. |

## JWT Rule / Quy tắc JWT

- Access token thời hạn ngắn.
- Refresh token thời hạn dài hơn và có cơ chế thu hồi.
- Token không được log raw.
- Token phải gắn actor, role, permission scope và tenant scope khi triển khai.
- Endpoint đổi mật khẩu, khóa tài khoản hoặc refresh token phải vô hiệu hóa session phù hợp.

## Refresh Token / Refresh token

| Rule / Quy tắc | Guidance / Hướng dẫn |
| --- | --- |
| Rotation | Nên rotate refresh token khi refresh thành công. |
| Revocation | Logout, đổi mật khẩu hoặc khóa tài khoản phải thu hồi session liên quan. |
| Storage | Không lưu token raw ở database nếu triển khai sau. |
| Response | Không trả refresh token trong resource response thông thường. |

## Authorization / Phân quyền

| Role / Vai trò | API Scope / Phạm vi API |
| --- | --- |
| Guest | Public product, category, brand, blog, cart limited và checkout limited nếu được bật. |
| Customer | Dữ liệu cá nhân, cart, wishlist, own orders, reviews, notifications, AI customer features. |
| Member | Customer scope cộng loyalty nếu đủ điều kiện. |
| VIP Customer | Member scope cộng quyền lợi VIP theo business rule. |
| Staff | Admin limited cho order, product, inventory, customer support và content theo phân công. |
| Manager | Quản lý vận hành, promotion, analytics, review, notification và AI marketing approval. |
| Administrator | Quản trị sản phẩm, người dùng, phân quyền, settings và toàn bộ vận hành cửa hàng. |
| Super Admin | SaaS/multi-tenant tương lai, chỉ dùng cho platform scope. |

## Permission Naming / Đặt tên permission

Permission dùng pattern: `<domain>:<action>`.

Ví dụ:

- `products:read`.
- `products:manage`.
- `orders:process`.
- `inventory:adjust`.
- `payments:refund`.
- `ai:use`.
- `ai:review`.
- `settings:manage`.

## API Key / API key

API key chỉ dùng khi:

- Provider webhook không dùng được user JWT.
- Integration nội bộ cần machine-to-machine.
- Export/import automation được phê duyệt.

API key phải có scope, expiry, rotation, audit và rate limit riêng.

## CORS Policy / Chính sách CORS

- Development chỉ cho phép origin dev đã khai báo trong environment.
- Production chỉ cho phép domain HealthyHub được phê duyệt.
- Không dùng wildcard origin cho credential request.
- Header `Authorization`, `Content-Type`, `X-Request-Id`, `X-Trace-Id`, `X-Idempotency-Key` cần được allow khi triển khai.

## Rate Limiting / Giới hạn gọi API

| Endpoint Group / Nhóm endpoint | Rate Limit Level / Mức giới hạn |
| --- | --- |
| Authentication | Strict |
| Password/OTP/verify email | Very strict |
| Public product browse | Normal |
| Cart/order/payment | Strict |
| Admin management | Normal to strict theo action |
| Upload/import/export | Strict |
| AI endpoint | Strict theo cost và safety |
| Webhook | Provider-specific strict |

## Sensitive Data / Dữ liệu nhạy cảm

- Password, OTP, token raw, provider secret và payment card data không được trả ra API.
- Email, phone, address cần masking khi không phải owner hoặc admin có quyền.
- AI sources phải tôn trọng permission scope.
- Error message không lộ SQL, stack trace, storage key hoặc prompt raw.

