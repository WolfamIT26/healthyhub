# Database / Cơ sở dữ liệu

## Database Engine / Hệ quản trị

HealthyHub sử dụng MySQL và SQL.

## Naming / Quy tắc đặt tên

- Table name dùng tiếng Anh, dạng snake_case và số nhiều khi phù hợp.
- Column name dùng tiếng Anh, dạng snake_case.
- Primary key ưu tiên `id`.
- Foreign key dùng dạng `{entity}_id`.
- Timestamp chuẩn: `created_at`, `updated_at`, `deleted_at`.

## Design Rule / Quy tắc thiết kế

- Mọi thay đổi schema phải có migration.
- Mọi bảng quan trọng phải có mô tả trong `Database.md` của module.
- Query phục vụ danh sách phải có pagination.
- Column dùng để filter, sort hoặc join thường xuyên cần xem xét index.
- Không lưu secret thô trong database.

## Initial Domain Areas / Nhóm dữ liệu dự kiến

- Users and roles / Người dùng và vai trò.
- Products and categories / Sản phẩm và danh mục.
- Cart and orders / Giỏ hàng và đơn hàng.
- Payments / Thanh toán.
- Inventory / Tồn kho.
- Reviews / Đánh giá.
- AI interactions / Tương tác AI.
- Marketing campaigns / Chiến dịch marketing.

## Authentication Data Implementation / Triển khai dữ liệu Authentication

Prompt 16 đã tạo hai TypeORM migrations rollback được: User identity/RBAC foundation và bốn bảng Authentication. Entity dùng BaseAudit/optimistic version; password/refresh/reset/verification/identifier/IP chỉ lưu hash và không default-select. `TYPEORM_SYNCHRONIZE` tiếp tục tắt.

Unit migration/entity tests đã đạt. Migration run/revert trên MySQL 8 còn blocked vì Docker daemon chưa hoạt động; phải hoàn tất bước này trước khi coi database verification hoàn thành.
