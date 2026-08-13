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
- Đếm operation trong `openapi/openapi.yaml`: 196.
- Đếm endpoint từ `.spec/api/domains`: 196.
- Kiểm tra `operationId` không trùng: Passed, 196 unique operationId.
- Kiểm tra `$ref` local/external quan trọng: Passed.
- Đếm schema dùng chung: 55.
- Quét pattern secret hoặc dấu hiệu chưa hoàn thiện rõ ràng trong `openapi`: Passed.
- `git diff --check`: Passed.

## Prompt 27.3 / Prompt 27.3

- Bổ sung reusable query parameters cho `paymentId` và signed VNPAY Return/IPN fields.
- Ghi rõ browser return read-only và IPN authoritative trong operation description.
- Không thêm operation, credential, secret example hoặc provider mới.

## Prompt 29 / Prompt 29

- Thêm `schemas/customer.yaml` cho editable Profile, structured VN Address, list/single/delete envelopes.
- Thay generic schemas ở sáu Customer self operations, bỏ pagination/filter khỏi hai singleton/small-list reads.
- Giữ owner/JWT/idempotency/error boundary và operation inventory 196/196.

## Limits / Giới hạn

- Chưa chạy semantic OpenAPI validator chuyên dụng vì framework hiện chưa có dependency validator và Prompt yêu cầu không cài thêm công nghệ mới.
- Schema nghiệp vụ chi tiết theo từng domain chưa được sinh ở phase này; hiện dùng contract chung để tránh tạo DTO code hoặc thiết kế nghiệp vụ mới ngoài spec.
