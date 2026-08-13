# OpenAPI Status / Trạng thái OpenAPI

## Current Status / Trạng thái hiện tại

- Status: Completed for Prompt 13
- Date: 2026-08-06
- Version: 1.0.0
- Scope: OpenAPI 3.1 contract only

## Coverage / Mức bao phủ

- Domain count: 23
- Endpoint operation count: 196
- Path item count: 169
- Shared schema count: 55
- Webhook event contracts: 3
- Shared response status codes: 13

## Validation Status / Trạng thái kiểm tra

- YAML syntax: Passed for 8 YAML files in `openapi`.
- `$ref` existence check: Passed for local/external references.
- `operationId` uniqueness: Passed, 196 unique operationId.
- API Spec endpoint count match: Passed, 196 operation from `.spec/api/domains`.
- Secret/example scan: Passed for obvious unfinished-marker or secret patterns in `openapi`.
- Prompt 27.3: VNPAY Return/IPN signed query parameters and authority notes documented; validation remains 196/196 operations.

## Limitations / Giới hạn

- Chưa sinh DTO nghiệp vụ chi tiết cho từng domain vì Prompt 13 chỉ yêu cầu OpenAPI contract và không sinh code.
- Chưa chạy OpenAPI semantic validator chuyên dụng vì dự án chưa có dependency validator sẵn và không cài thêm công nghệ mới.
