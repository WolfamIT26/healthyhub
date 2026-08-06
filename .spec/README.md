# Specification System / Hệ thống đặc tả

## Purpose / Mục tiêu

`.spec` là nguồn tài liệu chính để AI sinh code ở các giai đoạn sau. Thư mục này hiện chứa đặc tả tính năng, Domain Model, Logical Database Design, Physical Database Design, Data Contract Specification, API Specification và UI Contract Specification của HealthyHub.

## Rule / Quy tắc

- Mỗi tính năng phải có folder riêng trong `.spec/features`.
- Mỗi tính năng phải điền đủ template trong `.spec/_template`.
- Không sinh code nếu feature specification chưa rõ acceptance criteria.

## Index / Mục lục

- [Feature Specifications / Đặc tả tính năng](features/README.md).
- [Domain Model / Mô hình domain](domain/README.md).
- [Logical Database Design / Thiết kế database logic](database/README.md).
- [Physical Database Design / Thiết kế database vật lý](database-physical/README.md).
- [Data Contract Specification / Đặc tả chuẩn dữ liệu](data-contracts/README.md).
- [API Specification / Đặc tả API](api/README.md).
- [UI Contract Specification / Đặc tả hợp đồng UI](ui-contract/README.md).

## Prompt 06 Rule / Quy tắc Prompt 06

Prompt 06 chỉ tạo business feature specification trong từng `README.md` của feature. Các file kỹ thuật như Database, API, UI, Security hoặc Testing sẽ được điền ở prompt chuyên trách sau, không tạo trong Prompt 06.

## Prompt 07 Rule / Quy tắc Prompt 07

Prompt 07 chỉ tạo Domain Model ở mức nghiệp vụ và kiến trúc domain. Domain Model không thay thế Database Design, API Design hoặc module implementation.

## Prompt 08 Rule / Quy tắc Prompt 08

Prompt 08 chỉ tạo Logical Database Documentation. Không viết SQL, không tạo migration, không tạo ORM model và không quyết định physical database schema.

## Prompt 09 Rule / Quy tắc Prompt 09

Prompt 09 chỉ tạo Physical Database Documentation. Không viết SQL, không sinh migration file, không tạo ORM model và không tạo code.

## Prompt 09.5 Rule / Quy tắc Prompt 09.5

Prompt 09.5 chỉ tạo Data Contract Documentation. Không tạo API endpoint, không viết DTO code, không tạo entity, không viết SQL và không tạo migration.

## Prompt 10 Rule / Quy tắc Prompt 10

Prompt 10 chỉ tạo API Specification bằng Markdown. Không tạo OpenAPI, không tạo Swagger, không viết controller, service, DTO code, entity, SQL hoặc migration.

## Prompt 11 Rule / Quy tắc Prompt 11

Prompt 11 chỉ tạo UI Contract bằng Markdown. Không thiết kế giao diện đẹp, không tạo Figma, không viết React, HTML, CSS, JavaScript hoặc TypeScript.
