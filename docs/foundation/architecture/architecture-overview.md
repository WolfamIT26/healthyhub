# Architecture Overview / Tổng quan kiến trúc

## Goal / Mục tiêu

Kiến trúc HealthyHub ưu tiên sự rõ ràng, dễ kiểm thử, dễ mở rộng và có thể chuyển dần sang microservice khi quy mô tăng. Ở giai đoạn đầu, modular monolith là lựa chọn thực tế vì giảm độ phức tạp vận hành nhưng vẫn giữ ranh giới module.

## Core Style / Phong cách chính

- Modular Monolith làm kiến trúc triển khai ban đầu.
- Clean Architecture làm nguyên tắc tách trách nhiệm.
- Gateway Pattern để bao bọc tích hợp bên ngoài.
- AI Layer là năng lực xuyên hệ thống.
- Documentation-first cho mọi thay đổi lớn.

## Main Layers / Các lớp chính

| Layer / Lớp | Responsibility / Trách nhiệm |
| --- | --- |
| Presentation | Nhận request, hiển thị UI, điều phối tương tác client. |
| Gateway | Kết nối hệ thống bên ngoài và che giấu chi tiết provider. |
| Business | Xử lý rule nghiệp vụ và use case. |
| Data | Truy cập database, migration, schema và query. |
| AI | Cung cấp năng lực AI dùng chung cho nhiều module. |

## Evolution Path / Hướng phát triển

Ban đầu các module nằm chung repository và triển khai cùng hệ thống. Khi một module có nhu cầu scale, release hoặc ownership riêng, module đó có thể được tách thành service nếu dependency đã sạch và contract đã rõ.

## Related / Liên quan

- [Modular Monolith / Monolith module hóa](modular-monolith.md)
- [Layer Architecture / Kiến trúc phân lớp](layer-architecture.md)
- [Gateway Architecture / Kiến trúc gateway](gateway-architecture.md)

