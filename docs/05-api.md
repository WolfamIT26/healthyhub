# API / Giao tiếp hệ thống

## API Style / Phong cách API

API dùng REST trước. Chỉ bổ sung pattern khác khi có quyết định kiến trúc rõ ràng.

## API Specification / Đặc tả API

API Specification chính nằm tại `.spec/api`. Đây là nguồn thiết kế endpoint trước khi sinh OpenAPI, Swagger, Backend hoặc Frontend.

Tài liệu cần đọc:

- API Index: `.spec/api/README.md`.
- API Convention: `.spec/api/api-conventions.md`.
- API Security: `.spec/api/security.md`.
- Authentication Flow: `.spec/api/authentication-flow.md`.
- Error Catalog: `.spec/api/error-catalog.md`.
- Domain API Specs: `.spec/api/domains`.

## Naming / Quy tắc đặt tên

- Endpoint dùng tiếng Anh.
- Resource dùng danh từ số nhiều.
- Versioning dùng `/api/v1` khi bắt đầu triển khai thực tế.
- Response dùng cấu trúc thống nhất.

## Required Documentation / Tài liệu bắt buộc

Mỗi API phải mô tả:

- Method.
- Path.
- Permission.
- Request params.
- Request body.
- Response success.
- Response error.
- Validation rule.
- Rate limit nếu có.

## Error Rule / Quy tắc lỗi

Lỗi API phải có mã lỗi, thông điệp rõ ràng và không lộ thông tin nội bộ như stack trace, SQL hoặc secret.

## OpenAPI and Collections / OpenAPI và API collections

- Prompt 10 chưa tạo OpenAPI hoặc Swagger mới.
- OpenAPI specification nằm tại `docs/api/openapi/openapi.yaml`.
- Swagger guideline nằm tại `docs/api/swagger`.
- Postman, Bruno và Insomnia collections nằm tại `api-collections`.
