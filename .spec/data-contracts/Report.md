# Data Contract Report / Báo cáo Data Contract

## Purpose / Mục tiêu

Báo cáo này tổng hợp kết quả Prompt 09.5: Generate Data Contract Specification.

## Summary / Tóm tắt

Đã tạo bộ Data Contract Specification tại `.spec/data-contracts` để chuẩn hóa dữ liệu trao đổi giữa Backend, Frontend, Mobile App tương lai và AI Layer.

Bộ tài liệu được xây dựng dựa trên:

- Business Blueprint.
- Feature Specifications.
- Domain Model.
- Physical Database Design.

## Added Documents / Tài liệu đã thêm

| Document / Tài liệu | Purpose / Mục tiêu |
| --- | --- |
| `README.md` | Contract Index và thứ tự đọc. |
| `contract-standards.md` | Tiêu chuẩn contract và DTO convention. |
| `data-format-standards.md` | Chuẩn định dạng dữ liệu. |
| `request-model.md` | Chuẩn request model. |
| `response-model.md` | Chuẩn response model. |
| `api-envelope.md` | Chuẩn envelope response. |
| `pagination-contract.md` | Chuẩn phân trang. |
| `filter-search-sort-contract.md` | Chuẩn lọc, tìm kiếm và sắp xếp. |
| `file-transfer-contract.md` | Chuẩn upload, download, import và export. |
| `error-standard.md` | Chuẩn lỗi. |
| `validation-response.md` | Chuẩn lỗi validation. |
| `ai-response.md` | Chuẩn phản hồi AI. |
| `metadata-contract.md` | Chuẩn metadata. |
| `enum-contract.md` | Chuẩn enum. |
| `versioning.md` | Chuẩn versioning và deprecation. |
| `domain-contract-map.md` | Mapping contract theo domain. |
| `Status.md` | Trạng thái bộ contract. |
| `Checklist.md` | Checklist kiểm tra contract. |
| `ChangeLog.md` | Nhật ký thay đổi contract. |

## Design Decisions / Quyết định thiết kế

| Decision / Quyết định | Reason / Lý do |
| --- | --- |
| Public field dùng `camelCase` | Phù hợp frontend/mobile và tách khỏi database `snake_case`. |
| Enum value dùng `lower_snake_case` | Ổn định, dễ đọc và phù hợp nhiều nền tảng. |
| Timestamp dùng ISO 8601 UTC | Thống nhất với backend lưu UTC và frontend tự format. |
| Money và decimal quan trọng dùng DecimalString | Tránh sai số floating point khi trao đổi dữ liệu. |
| Response dùng envelope thống nhất | Giúp client xử lý success, warning, error và metadata nhất quán. |
| AI response có confidence, source và safety | Đảm bảo traceability, audit và an toàn với AI Layer. |

## Boundary / Ranh giới

Prompt 09.5 chỉ tạo tài liệu Data Contract. Mọi endpoint, OpenAPI chi tiết, DTO code, validation runtime, entity và migration sẽ thuộc prompt chuyên trách sau.

