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
