# Backend Mapping / Ánh xạ backend Authentication

## Target Boundaries / Ranh giới đích

- Presentation: controllers/DTO validation/guards/decorators; bám OpenAPI sau khi conflict được giải quyết.
- Business: use cases, credential/session policies, domain events; không phụ thuộc HTTP/ORM trực tiếp.
- Data: Authentication repositories/entities và adapter User account transaction.
- Gateway: Notification cho verification/reset; clock/token/password hasher abstractions để test.

## Required Components / Thành phần cần có

Authentication module; register/login/refresh/logout/verify/resend/forgot/reset/change/session handlers; JWT authentication guard; session/account-state guard; role guard và permission guard; token issuer/verifier; password hasher; rotation/revocation service; login attempt/rate policy; security audit publisher; notification gateway adapter.

## Foundation Reuse / Tái sử dụng foundation

Giữ NestJS app, global validation/envelope/filter, TypeORM config, base audit, request context, logger/redaction và gateway registry. Nâng rate limit từ Map in-memory IP-only sang policy per-route + identifier và distributed-ready implementation. Không tạo app hoặc envelope khác.

## Transaction Boundaries / Ranh giới transaction

- Register: User account + credential + verification record/outbox intent.
- Login: attempt record và session creation theo kết quả; không để failure audit làm lộ timing.
- Refresh: verify old token + revoke/rotate + issue metadata atomically.
- Reset/change/status: credential/account mutation + session revocation atomically; notification/audit dùng reliable post-commit pattern.

## Authorization / Phân quyền

JWT xác định identity, session và token metadata; User domain cung cấp account state/roles/effective permissions. Guard phân biệt 401 (không xác thực) và 403 (đã xác thực, thiếu quyền). Admin status endpoint vẫn thuộc User module nhưng Authentication cung cấp revoke capability.

## Data-access Foundation / Nền data-access đã triển khai

`AuthenticationRepository` và `TypeOrmAuthenticationRepository` cung cấp account lookup/create/status/password/email verification, role assignment, session create/lookup/atomic generation rotation/revoke/reuse, one-time reset/verification create-consume, login-attempt count/record và effective-permission reads. Runtime service/controller/module Prompt 17 đã được nối với data-access này. Các transaction đa bảng sẽ được xác minh và hoàn thiện cùng MySQL integration; refresh rotation hiện dùng conditional atomic update theo generation.
# Authentication Backend V1

NestJS runtime nằm tại `apps/api/src/presentation/authentication` và triển khai đúng 10 operationId Authentication trong OpenAPI hiện hữu. Các capability nội bộ bổ sung gồm logout-all, revoke-other-sessions khi đổi mật khẩu và revoke-all khi reset mật khẩu; không thêm endpoint ngoài OpenAPI.

## Security baseline

- Argon2id: 19 MiB, time cost 2, parallelism 1; password 12–128 Unicode và denylist cục bộ.
- Prompt 18.3: Register, Reset Password và Change Password dùng chung password-policy helper. Ngoài length/no-composition và deny-list nhỏ, backend từ chối password chứa full email, local-part, full domain hoặc domain label có ý nghĩa (không phân biệt hoa thường). Reset tra account từ token và kiểm tra policy trước khi consume token; Login không áp creation policy.
- Prompt 18.6: `EmailVerificationPolicyService` phân loại Customer-only và Internal. Customer pending/unverified được login, refresh và nhận `actor.isEmailVerified=false`; Internal unverified bị `AUTH.EMAIL_NOT_VERIFIED` và không tạo session/JWT. Forgot/Reset/Change Password gọi cùng verified-email policy. Checkout/Payment/Change Email/Delete/Recovery chưa có endpoint trong repository và phải gắn helper này khi được triển khai.
- Access JWT 15 phút với `sub`, `sid`, `roles`, `permissionsVersion`, issuer/audience.
- Refresh opaque 256-bit, chỉ lưu SHA-256, rotation theo generation và phát hiện reuse.
- Web dùng `__Host-hh_refresh` HttpOnly/Secure/SameSite=Lax và signed double-submit CSRF; mobile dùng `X-Refresh-Token`.
- Login lock: 5 lần thất bại trong 15 phút, khóa 15 phút; identifier/IP được HMAC trước khi lưu.
- Resend vẫn trả accepted. Forgot trả accepted cho account verified/unknown nhưng trả `AUTH.EMAIL_NOT_VERIFIED` theo policy sản phẩm khi nhận diện account chưa verify.

Notification hiện là local no-op adapter qua gateway interface. Provider email thật, distributed rate limiter và signing-key rotation là công việc vận hành tiếp theo, không làm thay đổi contract V1.
