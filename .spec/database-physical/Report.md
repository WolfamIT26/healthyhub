# Physical Database Report / Báo cáo Physical Database Design

## Task / Nhiệm vụ

Thiết kế Physical Database Design cho HealthyHub dựa trên Logical Database Design, không viết SQL, không sinh migration file, không tạo ORM và không tạo code.

## Summary / Tóm tắt

Prompt 09 đã tạo hệ thống tài liệu physical database tại `.spec/database-physical`. Mỗi domain có một file riêng, mô tả table list, column list, MySQL type, nullable, default, PK, FK, unique/check constraint, index, composite index, full text index, generated column, FK rule, performance và retention.

## Added / Đã thêm

- `.spec/database-physical/README.md`: Physical Database Index.
- `.spec/database-physical/physical-standards.md`: Chuẩn MySQL, kiểu dữ liệu và audit strategy.
- `.spec/database-physical/relationship-rules.md`: Quy tắc FK, cascade, restrict, set null.
- `.spec/database-physical/index-catalog.md`: Danh mục index, composite index và full text index.
- `.spec/database-physical/performance-strategy.md`: Index strategy, query guideline, partition, archive, retention.
- `.spec/database-physical/migration-strategy.md`: Versioning, rollback, seed data, environment.
- `.spec/database-physical/backup-recovery.md`: Backup, restore, disaster recovery.
- `.spec/database-physical/domains/README.md`: Index database vật lý theo domain.
- `.spec/database-physical/domains/*.md`: 23 tài liệu physical database riêng theo domain.
- `.spec/database-physical/Status.md`, `Report.md`, `Checklist.md`, `ChangeLog.md`.

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
- Không tạo migration file.
- Không tạo ORM model.
- Không tạo backend/frontend/API.
- Không tạo code nghiệp vụ.

## Design Notes / Ghi chú thiết kế

- Physical design dùng MySQL 8, InnoDB, utf8mb4.
- PK mặc định là BIGINT UNSIGNED; các key công khai và unique được chuẩn hóa bằng VARCHAR length phù hợp.
- Đã chuẩn bị index, retention, archive và backup cho các bảng giao dịch, log và AI/analytics có tần suất tăng cao.
