# Layer Architecture / Kiến trúc phân lớp

## Layer Model / Mô hình lớp

HealthyHub dùng năm lớp chính: Presentation, Gateway, Business, Data và AI. Các lớp này giúp tách trách nhiệm, giảm phụ thuộc chéo và hỗ trợ kiểm thử.

## Presentation Layer / Lớp trình bày

Lớp này xử lý tương tác người dùng hoặc client: trang web, route, controller, request validation ở biên và response format. Presentation không chứa rule nghiệp vụ lõi.

## Gateway Layer / Lớp cổng tích hợp

Lớp này bao bọc AI provider, payment provider, storage provider, notification provider và các tích hợp bên ngoài. Gateway phải chuyển lỗi provider thành lỗi nội bộ dễ xử lý.

## Business Layer / Lớp nghiệp vụ

Lớp này giữ use case, policy nghiệp vụ và orchestration giữa module. Business Layer không gọi trực tiếp database driver hoặc SDK provider bên ngoài.

## Data Layer / Lớp dữ liệu

Lớp này quản lý truy cập MySQL, migration, seed, schema và tối ưu query. Data Layer phải tôn trọng ownership của module.

## AI Layer / Lớp AI

Lớp này quản lý prompt, context, skill, safety, memory, review và giao tiếp AI Gateway. AI Layer có thể phục vụ nhiều module nhưng phải có kiểm soát ngữ cảnh và logging.

## Related / Liên quan

- [Clean Architecture / Kiến trúc sạch](clean-architecture.md)
- [AI Architecture / Kiến trúc AI](ai-architecture.md)

