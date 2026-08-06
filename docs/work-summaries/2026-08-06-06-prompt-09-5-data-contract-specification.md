# Prompt 09.5 - Data Contract Specification / Tổng hợp đặc tả chuẩn dữ liệu

## Task / Nhiệm vụ

Tạo Data Contract Specification cho HealthyHub dựa trên Business Blueprint, Feature Specifications, Domain Model và Physical Database Design.

## Summary / Tóm tắt

Đã tạo bộ tài liệu `.spec/data-contracts` để chuẩn hóa dữ liệu dùng chung trước khi thiết kế API. Bộ này định nghĩa request model, response model, API envelope, pagination, filter, search, sort, file transfer, error, validation, AI response, metadata, enum và versioning.

## Added / Đã thêm

- `.spec/data-contracts/README.md`
- `.spec/data-contracts/contract-standards.md`
- `.spec/data-contracts/data-format-standards.md`
- `.spec/data-contracts/request-model.md`
- `.spec/data-contracts/response-model.md`
- `.spec/data-contracts/api-envelope.md`
- `.spec/data-contracts/pagination-contract.md`
- `.spec/data-contracts/filter-search-sort-contract.md`
- `.spec/data-contracts/file-transfer-contract.md`
- `.spec/data-contracts/error-standard.md`
- `.spec/data-contracts/validation-response.md`
- `.spec/data-contracts/ai-response.md`
- `.spec/data-contracts/metadata-contract.md`
- `.spec/data-contracts/enum-contract.md`
- `.spec/data-contracts/versioning.md`
- `.spec/data-contracts/domain-contract-map.md`
- `.spec/data-contracts/Status.md`
- `.spec/data-contracts/Report.md`
- `.spec/data-contracts/Checklist.md`
- `.spec/data-contracts/ChangeLog.md`

## Updated / Đã cập nhật

- `README.md`
- `.spec/README.md`
- `docs/README.md`
- `docs/01-folder-structure.md`
- `CAU_TRUC_THU_MUC.md`
- `TONG_HOP_DA_LAM.md`
- `CHANGELOG.md`
- `docs/18-framework-inventory.md`
- `docs/work-summaries/README.md`

## Not Changed / Không thay đổi

- Không tạo API endpoint.
- Không viết DTO TypeScript.
- Không tạo entity hoặc ORM model.
- Không viết SQL hoặc migration.
- Không thay đổi source frontend/backend.
- Không thay đổi technology stack.

## Verification / Kiểm tra

- Kiểm tra danh sách file trong `.spec/data-contracts`.
- Kiểm tra không có file code, SQL, migration hoặc endpoint được tạo trong Data Contract.
- Kiểm tra Markdown bằng `git diff --check`.

## Notes / Ghi chú

Prompt tiếp theo về API Specification nên đọc `.spec/data-contracts/README.md` sau Physical Database Design để dùng đúng chuẩn dữ liệu chung.

