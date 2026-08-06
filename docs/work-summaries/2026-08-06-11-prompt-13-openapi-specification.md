# Prompt 13 - OpenAPI Specification / Tổng hợp OpenAPI Specification

## Task / Nhiệm vụ

Sinh OpenAPI Specification 3.1 cho HealthyHub dựa trên API Specification và Data Contract đã có.

## Summary / Tóm tắt

Đã tạo bộ OpenAPI chính thức tại `openapi/`. Bộ này mô tả API contract, schema dùng chung, response chuẩn, parameter, security scheme, example và webhook contract. Không viết backend, frontend, migration, controller, service, DTO TypeScript, SDK hoặc logic nghiệp vụ.

## Added / File và thư mục đã thêm

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

## Updated / File đã cập nhật

- `README.md`
- `docs/README.md`
- `docs/01-folder-structure.md`
- `docs/api/README.md`
- `docs/api/openapi/README.md`
- `CAU_TRUC_THU_MUC.md`
- `TONG_HOP_DA_LAM.md`
- `docs/18-framework-inventory.md`
- `docs/work-summaries/README.md`
- `CHANGELOG.md`

## Coverage / Mức bao phủ

- Domain: 23.
- API operation: 194.
- Path item: 167.
- Shared schema: 55.
- Webhook contract: 3 gồm payment, shipping, notification.

## Merged / Mục đã hợp nhất hoặc mapping

- `openapi/openapi.yaml` là OpenAPI Specification chính thức.
- `docs/api/openapi/openapi.yaml` là placeholder cũ, được giữ lại để không phá cấu trúc đã có.
- `docs/api/README.md` và `docs/api/openapi/README.md` đã được cập nhật để chỉ rõ mapping này.

## Verification / Kiểm tra đã chạy

- Parse YAML cho toàn bộ `openapi/**/*.yaml`: passed.
- Kiểm tra `$ref` local/external quan trọng: passed.
- Kiểm tra `operationId` không trùng: passed, 194 unique operationId.
- Đối chiếu số operation với `.spec/api/domains`: passed, cùng 194 operation.
- Quét pattern secret/placeholder rõ ràng trong `openapi`: passed.
- `git diff --check`: passed.

## Not Changed / Không thay đổi

- Không sửa API Specification gốc trong `.spec/api`.
- Không tạo code backend/frontend.
- Không tạo SQL, migration, ORM model, controller, service, DTO code hoặc SDK.
- Không cài thêm dependency hoặc công nghệ mới.

## Notes / Ghi chú

- Chưa chạy semantic OpenAPI validator chuyên dụng vì framework chưa có công cụ validator sẵn và prompt yêu cầu không cài thêm công nghệ mới.
- Schema nghiệp vụ chi tiết theo từng domain nên được sinh ở phase sau khi bắt đầu thiết kế DTO/API implementation.
