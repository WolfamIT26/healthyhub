# Data Contract ChangeLog / Nhật ký thay đổi Data Contract

## [0.2.0] - 2026-08-06

### Added / Đã thêm

- Thêm `authentication-contract.md` cho token delivery Web/Mobile, password policy, auth response payload, role/permission và canonical errors.

### Changed / Thay đổi

- Giữ public contract `v1`; bổ sung schema cụ thể là thay đổi tương thích trước implementation.
- Chốt refresh token không xuất hiện trong JSON body cho Web và mọi token response dùng `Cache-Control: no-store`.

## [0.1.0] - 2026-08-06

### Added / Đã thêm

- Tạo Data Contract Specification tại `.spec/data-contracts`.
- Tạo Contract Index và thứ tự đọc.
- Tạo chuẩn contract nền cho naming, DTO convention, field exposure, ID, privacy và compatibility.
- Tạo chuẩn định dạng dữ liệu cho datetime, timezone, number, currency, decimal, boolean, null, collection, file URL và image URL.
- Tạo request model và response model dùng chung.
- Tạo API envelope cho success, warning, error, pagination, metadata, request ID và trace ID.
- Tạo pagination contract, filter/search/sort contract và file transfer contract.
- Tạo error standard, validation response và AI response contract.
- Tạo metadata contract, enum contract, versioning và domain contract map.

### Notes / Ghi chú

- Không tạo API endpoint.
- Không viết DTO code.
- Không tạo entity, ORM model, SQL hoặc migration.
- Bộ tài liệu này là đầu vào cho Prompt API Specification sau này.
