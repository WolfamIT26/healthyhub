# MySQL Style Guide / Chuẩn MySQL

## Purpose / Mục tiêu

MySQL là database chính của HealthyHub. Mọi thay đổi schema ở phase sau phải bám Logical/Physical Database Design và cập nhật tài liệu liên quan.

## Naming Convention / Quy ước đặt tên

- Table dùng tiếng Anh, snake_case, số nhiều khi phù hợp.
- Column dùng tiếng Anh, snake_case.
- Primary key dùng tên rõ như `id` hoặc theo chuẩn Physical Database Design.
- Foreign key dùng tên thể hiện quan hệ, ví dụ theo domain owner.
- Index, unique và constraint phải có tên mô tả mục đích.

## Migration Rule / Quy tắc migration

- Không chỉnh sửa migration đã áp dụng.
- Migration phải nhỏ, có mục đích rõ và có rollback nếu công cụ hỗ trợ.
- Seed data tách riêng migration schema.
- Mọi thay đổi schema phải cập nhật specification, changelog và decision record nếu là quyết định kiến trúc.

## Constraint Rule / Quy tắc ràng buộc

- Foreign key, unique, index và audit fields bám Physical Database Design.
- Không xóa hoặc đổi column tùy ý khi có dữ liệu đã sử dụng.
- Soft delete theo Physical Database Design nếu domain yêu cầu.
- Audit fields cần nhất quán cho bảng nghiệp vụ quan trọng.

## Transaction Concurrency / Transaction và đồng thời

- Dùng transaction cho đặt hàng, cập nhật tồn kho, payment status, refund và thao tác nhiều bảng.
- Cần xử lý concurrency ở tồn kho, coupon usage, loyalty point và payment callback.
- Tránh race condition khi cập nhật trạng thái đơn.

## Performance Rule / Quy tắc hiệu năng

- Danh sách lớn phải có pagination.
- Query thường dùng phải có index theo Physical Database Design.
- Tránh N+1 query.
- Chỉ lấy field cần thiết khi phục vụ API list.

