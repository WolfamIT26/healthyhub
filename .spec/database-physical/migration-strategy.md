# Migration Strategy / Chiến lược Migration

## Purpose / Mục tiêu

Tài liệu này định nghĩa quy tắc migration để prompt sau có thể sinh migration an toàn. Prompt 09 không tạo migration file.

## Versioning Rule / Quy tắc versioning

- Mỗi migration phải có mã phiên bản tăng dần và mô tả rõ mục đích.
- Một migration chỉ nên xử lý một nhóm thay đổi liên quan.
- Migration thay đổi dữ liệu lớn phải có kế hoạch batch hoặc maintenance window.
- Thay đổi ảnh hưởng nhiều domain cần ADR hoặc migration note riêng.

## Rollback Rule / Quy tắc rollback

- Migration phải có rollback plan trước khi chạy ở production.
- Thêm column nullable thường rollback dễ hơn đổi/xóa column.
- Xóa hoặc đổi kiểu dữ liệu phải có backup trước và kế hoạch phục hồi.
- Migration không thể rollback tự động phải ghi rõ manual rollback.

## Seed Data Rule / Quy tắc seed data

- Seed chỉ dùng cho dữ liệu nền cần hệ thống chạy như role, permission, default setting, payment/shipping method.
- Seed không chứa dữ liệu khách thật.
- Seed phải tách theo environment.
- Seed production cần review và approval.

## Initial Data / Dữ liệu khởi tạo

Ứng viên dữ liệu khởi tạo:

- Default tenant/store profile.
- Admin role và permission cơ bản.
- Default store settings.
- Payment method trạng thái thủ công/COD.
- Shipping method mặc định.
- Notification template hệ thống.

## Environment Rule / Quy tắc môi trường

| Environment / Môi trường | Migration Rule / Quy tắc |
| --- | --- |
| Development | Có thể reset dữ liệu mẫu nếu không chứa dữ liệu thật. |
| Test | Migration phải chạy tự động và có thể lặp lại. |
| Staging | Gần giống production, dùng để kiểm rollback/backup. |
| Production | Chỉ chạy migration đã review, có backup và rollback plan. |

## Release Rule / Quy tắc release

- Pre-release backup bắt buộc trước migration rủi ro.
- Migration schema và deploy backend phải có thứ tự tương thích ngược khi có thể.
- Không đổi tên/xóa column đang được code production dùng nếu chưa có giai đoạn deprecate.
