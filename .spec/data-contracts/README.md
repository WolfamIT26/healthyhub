# Data Contract Index / Mục lục chuẩn dữ liệu

## Purpose / Mục tiêu

Thư mục `.spec/data-contracts` định nghĩa chuẩn dữ liệu dùng chung cho Backend, Frontend, Mobile App tương lai và AI Layer của HealthyHub.

Data Contract là bước trung gian giữa Physical Database Design và API Specification. Tài liệu này không tạo endpoint, không tạo DTO code, không tạo entity và không tạo migration.

## Scope / Phạm vi

Data Contract chuẩn hóa:

- Mô hình request và response.
- Quy tắc DTO ở mức tài liệu.
- Pagination, filter, search và sort.
- Upload, download, import và export.
- Success, warning, error và validation response.
- AI response, metadata, enum và versioning.
- Chuẩn định dạng dữ liệu cho thời gian, tiền tệ, số thập phân, boolean, null, file URL và image URL.

## Reading Order / Thứ tự đọc

1. [Contract Standards / Tiêu chuẩn contract](contract-standards.md).
2. [Data Format Standards / Chuẩn định dạng dữ liệu](data-format-standards.md).
3. [Request Model / Mô hình request](request-model.md).
4. [Response Model / Mô hình response](response-model.md).
5. [API Envelope / Khung phản hồi API](api-envelope.md).
6. [Pagination Contract / Chuẩn phân trang](pagination-contract.md).
7. [Filter Search Sort Contract / Chuẩn lọc, tìm kiếm, sắp xếp](filter-search-sort-contract.md).
8. [File Transfer Contract / Chuẩn upload, download, import, export](file-transfer-contract.md).
9. [Error Standard / Chuẩn lỗi](error-standard.md).
10. [Validation Response / Chuẩn phản hồi validation](validation-response.md).
11. [AI Response / Chuẩn phản hồi AI](ai-response.md).
12. [Metadata Contract / Chuẩn metadata](metadata-contract.md).
13. [Enum Contract / Chuẩn enum](enum-contract.md).
14. [Versioning / Quản lý phiên bản contract](versioning.md).
15. [Domain Contract Map / Bản đồ contract theo domain](domain-contract-map.md).
16. [Authentication Contract V1 / Contract xác thực V1](authentication-contract.md).

## Contract Groups / Nhóm contract

| Group / Nhóm | Document / Tài liệu | Usage / Cách dùng |
| --- | --- | --- |
| Core | `contract-standards.md` | Quy tắc nền cho mọi contract. |
| Data Format | `data-format-standards.md` | Chuẩn hóa kiểu dữ liệu qua frontend, backend, mobile và AI. |
| Request | `request-model.md` | Chuẩn hóa dữ liệu đầu vào trước khi thiết kế API. |
| Response | `response-model.md`, `api-envelope.md` | Chuẩn hóa dữ liệu đầu ra và envelope. |
| Query | `pagination-contract.md`, `filter-search-sort-contract.md` | Chuẩn hóa danh sách, lọc, tìm kiếm và sắp xếp. |
| File | `file-transfer-contract.md` | Chuẩn hóa file, ảnh, import và export. |
| Error | `error-standard.md`, `validation-response.md` | Chuẩn hóa lỗi nghiệp vụ, validation, hệ thống và AI. |
| AI | `ai-response.md` | Chuẩn hóa dữ liệu trả về từ AI Layer. |
| Governance | `metadata-contract.md`, `enum-contract.md`, `versioning.md` | Chuẩn hóa metadata, enum và vòng đời contract. |
| Domain | `domain-contract-map.md` | Mapping contract theo domain của HealthyHub. |
| Authentication | `authentication-contract.md` | Request/response, token delivery, RBAC và error contract Authentication V1. |

## Input References / Tài liệu đầu vào

- [Business Blueprint](../../docs/business-blueprint/README.md).
- [Feature Specifications](../features/README.md).
- [Domain Model](../domain/README.md).
- [Physical Database Design](../database-physical/README.md).

## Output Rule / Quy tắc đầu ra

- Không sinh API endpoint.
- Không viết DTO bằng TypeScript.
- Không viết entity hoặc ORM model.
- Không viết SQL hoặc migration.
- Không thêm nghiệp vụ mới ngoài phạm vi đã có trong Business Blueprint, Feature Specifications, Domain Model và Physical Database Design.
