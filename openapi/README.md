# OpenAPI Specification / Đặc tả OpenAPI

Tài liệu này là nguồn OpenAPI 3.1 chính thức cho HealthyHub ở giai đoạn contract. Nội dung bám theo API Specification trong `.spec/api/` và Data Contract trong `.spec/data-contracts/`.

## Main Files / File chính

- `openapi.yaml`: đặc tả OpenAPI 3.1 tổng hợp, gồm 196 operation thuộc 23 domain.
- `schemas/common.yaml`: schema dùng chung cho envelope, error, pagination, upload, AI, money, address và audit metadata.
- `parameters/common.yaml`: header, query parameter và path parameter dùng lại.
- `responses/common.yaml`: response chuẩn 200, 201, 202, 204, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503.
- `examples/common.yaml`: example an toàn, không chứa secret, token thật hoặc mật khẩu.
- `security/security-schemes.yaml`: Bearer JWT, Refresh Token, API Key và Webhook Signature.
- `webhooks/provider-webhooks.yaml`: mô tả webhook payment, shipping, notification.
- `paths/domain-map.yaml`: bản đồ endpoint theo domain để dễ tra cứu.

## Rules / Quy tắc

- Prefix API giữ nguyên `/api/v1` để khớp API Specification.
- Response dùng envelope chuẩn của Data Contract.
- Endpoint public khai báo `security: []`; endpoint optional auth khai báo hai lựa chọn `{}` và `BearerAuth`.
- Các thao tác nhạy cảm có `X-Idempotency-Key` và ghi chú `x-idempotency-required`.
- OpenAPI này chưa sinh DTO nghiệp vụ chi tiết; schema domain cụ thể sẽ được mở rộng ở phase backend/API DTO sau.
