# Database Report / Báo cáo Logical Database Design

## Task / Nhiệm vụ

Thiết kế Logical Database Model cho HealthyHub dựa trên Domain Model, không viết SQL, không tạo migration, không tạo ORM model và không tạo code.

## Summary / Tóm tắt

Prompt 08 đã tạo hệ thống tài liệu database logic tại `.spec/database`. Mỗi domain có một file riêng, mô tả mục đích lưu trữ, entity, thuộc tính chính, PK, FK, quan hệ, cardinality, ràng buộc, delete strategy, audit fields, trạng thái dữ liệu, lifecycle, ownership, validation và data dictionary.

## Added / Đã thêm

- `.spec/database/README.md`: Database Index.
- `.spec/database/database-standards.md`: Chuẩn naming, ID, timestamp, enum và lookup.
- `.spec/database/domain-data-map.md`: Bản đồ ownership dữ liệu theo domain.
- `.spec/database/cross-domain-relationships.md`: Quan hệ dữ liệu liên domain.
- `.spec/database/logical-erd.md`: Logical ERD dạng mô tả.
- `.spec/database/data-readiness.md`: Chuẩn bị multi-tenant, audit, AI, analytics, versioning và soft delete.
- `.spec/database/domains/README.md`: Index database theo domain.
- `.spec/database/domains/*.md`: 23 tài liệu logical database riêng theo domain.
- `.spec/database/Status.md`, `Report.md`, `Checklist.md`, `ChangeLog.md`.

## Updated / Đã cập nhật

- `.spec/README.md`.
- `README.md`.
- `docs/README.md`.
- `docs/01-folder-structure.md`.
- `CAU_TRUC_THU_MUC.md`.
- `CHANGELOG.md`.
- `docs/work-summaries/README.md`.

## Not Generated / Không sinh

- Không viết SQL.
- Không tạo migration.
- Không tạo ORM model.
- Không tạo Entity Framework.
- Không tạo source code.
- Không quyết định physical database engine/detail.

## Design Notes / Ghi chú thiết kế

- Logical model dùng English database object names theo rule dự án.
- `tenant_id`, audit fields, status fields và versioning được chuẩn bị ở mức logical để hỗ trợ SaaS/multi-tenant sau này.
- Order item, shipping address và payment/order status snapshot được mô tả để giữ lịch sử nghiệp vụ khi dữ liệu gốc thay đổi.
