# Physical Database ChangeLog / Nhật ký thay đổi Physical Database Design

## [1.2.0] - 2026-08-13

- Added Product featured, storage note, dietary tags and nutrition fact columns/tables implemented by Prompt 31 migrations.
- Confirmed persisted Category display rule and one-active-primary Product/Category constraint.

## [1.1.0] - 2026-08-06

### Changed / Đã thay đổi

- Chốt Authentication V1 single-tenant: bỏ `tenant_id` khỏi bốn bảng Authentication và ghi migration path SaaS tương lai.
- Bổ sung session public ID, hashed rotating refresh token, family/generation, reuse/compromise/revoke fields và indexes.
- Giảm dữ liệu riêng tư: keyed hash cho email/IP, coarse user-agent; chốt retention và cleanup.

## [0.1.0] - 2026-08-06

### Added / Đã thêm

- Tạo Physical Database Design cho HealthyHub tại `.spec/database-physical`.
- Tạo Physical Standards, Relationship Rules, Index Catalog, Performance Strategy, Migration Strategy và Backup Recovery.
- Tạo 23 tài liệu physical database riêng trong `.spec/database-physical/domains`.
- Tạo Status, Report, Checklist và ChangeLog cho Physical Database Design.

### Notes / Ghi chú

- Phạm vi chỉ là physical database documentation.
- Không viết SQL, migration file, ORM model hoặc code.
