# Relationship Rules / Quy tắc quan hệ vật lý

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa foreign key, cascade, restrict và set null trong Physical Database Design.

## Foreign Key Rule / Quy tắc khóa ngoại

- FK cùng kiểu với PK: `BIGINT UNSIGNED`.
- FK bắt buộc dùng `NOT NULL` nếu child không có nghĩa khi thiếu parent.
- FK actor như `created_by`, `updated_by`, `deleted_by`, `changed_by`, `reviewed_by` có thể nullable để giữ dữ liệu khi user bị khóa/xóa mềm.
- Cross-domain FK cần cân nhắc ownership. Nếu domain nguồn có thể tách service trong tương lai, FK vật lý có thể được thay bằng application-level reference theo ADR.

## Delete Rule / Quy tắc xóa

| Rule / Quy tắc | Use Case / Khi dùng | Guidance / Hướng dẫn |
| --- | --- | --- |
| Restrict | Dữ liệu vận hành hoặc giao dịch | Mặc định cho order, payment, shipping, inventory, customer, product đã có lịch sử. |
| Set Null | Actor hoặc reference tùy chọn | Dùng với `changed_by`, `reviewed_by`, optional provider/context references. |
| Cascade | Child tạm thời, không audit | Chỉ dùng cho draft/temporary child chưa gắn giao dịch; tránh cascade với dữ liệu quan trọng. |

## Cross Domain Rule / Quy tắc liên domain

- Không hard delete parent nếu child còn dữ liệu vận hành.
- Nếu parent bị soft delete, child giữ FK và xử lý bằng status/snapshot.
- Order item, shipping address và notification recipient giữ snapshot để bảo toàn lịch sử.
- AI và Analytics chỉ lưu reference/context metadata, không sở hữu dữ liệu nguồn.

## Constraint Naming Rule / Quy tắc đặt tên constraint

| Constraint / Ràng buộc | Pattern / Mẫu đặt tên |
| --- | --- |
| Primary key | `pk_<table>` |
| Foreign key | `fk_<table>_<referenced_table>` |
| Unique | `uq_<table>_<columns>` |
| Check | `ck_<table>_<rule>` |
| Index | `idx_<table>_<columns>` |
| Full text | `ft_<table>_<columns>` |

## Nullable Rule / Quy tắc nullable

- Business required field dùng `NOT NULL`.
- Lifecycle timestamp chưa xảy ra dùng nullable.
- Optional relation dùng nullable kèm rule rõ.
- Snapshot field trong transaction nên `NOT NULL` nếu cần bảo toàn lịch sử nghiệp vụ.
