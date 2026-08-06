# OpenAPI Report / Báo cáo OpenAPI

## Summary / Tóm tắt

Đã tạo bộ OpenAPI Specification 3.1 cho HealthyHub dựa trên API Specification và Data Contract hiện có. Không tạo backend, frontend, migration, controller, service, DTO TypeScript hoặc SDK.

## Added Files / File đã thêm

- `openapi/README.md`
- `openapi/openapi.yaml`
- `openapi/paths/README.md`
- `openapi/paths/domain-map.yaml`
- `openapi/schemas/common.yaml`
- `openapi/parameters/common.yaml`
- `openapi/responses/common.yaml`
- `openapi/examples/common.yaml`
- `openapi/security/security-schemes.yaml`
- `openapi/webhooks/provider-webhooks.yaml`
- `openapi/Status.md`
- `openapi/Report.md`
- `openapi/Checklist.md`
- `openapi/ChangeLog.md`

## Design Notes / Ghi chú thiết kế

- Giữ đầy đủ endpoint prefix `/api/v1` trong `paths` để dễ đối chiếu với `.spec/api/endpoint-matrix.md`.
- Dùng reusable component cho security, response, parameter, schema và example.
- Dùng vendor extension `x-permission`, `x-auth-level`, `x-rate-limit-note`, `x-idempotency-required` để AI Agent và backend phase sau đọc nhanh.
- Không đưa thông tin contact/license vào `info` vì Prompt yêu cầu chỉ thêm khi đã có dữ liệu chắc chắn.

## Validation / Kiểm tra

- YAML syntax parse cho toàn bộ `openapi/**/*.yaml`: Passed.
- Đếm operation trong `openapi/openapi.yaml`: 194.
- Đếm endpoint từ `.spec/api/domains`: 194.
- Kiểm tra `operationId` không trùng: Passed, 194 unique operationId.
- Kiểm tra `$ref` local/external quan trọng: Passed.
- Đếm schema dùng chung: 55.
- Quét pattern secret hoặc dấu hiệu chưa hoàn thiện rõ ràng trong `openapi`: Passed.
- `git diff --check`: Passed.

## Limits / Giới hạn

- Chưa chạy semantic OpenAPI validator chuyên dụng vì framework hiện chưa có dependency validator và Prompt yêu cầu không cài thêm công nghệ mới.
- Schema nghiệp vụ chi tiết theo từng domain chưa được sinh ở phase này; hiện dùng contract chung để tránh tạo DTO code hoặc thiết kế nghiệp vụ mới ngoài spec.
