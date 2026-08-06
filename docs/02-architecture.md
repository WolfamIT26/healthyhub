# Architecture / Kiến trúc

## Style / Phong cách kiến trúc

HealthyHub sử dụng Modular Monolith Architecture. Hệ thống được chia theo module nghiệp vụ rõ ràng nhưng triển khai trong một khối ứng dụng để giảm độ phức tạp ban đầu.

## Future Expansion / Mở rộng tương lai

Mỗi module phải có boundary rõ để có thể tách thành Microservice khi có nhu cầu về scale, team ownership hoặc deployment độc lập.

## Layers / Các lớp

- Presentation Layer / Lớp giao diện: React Web, sau này mở rộng Mobile App.
- Gateway Layer / Lớp gateway: cô lập tích hợp bên ngoài và provider.
- Business Layer / Lớp nghiệp vụ: xử lý rule theo domain.
- Data Layer / Lớp dữ liệu: MySQL, repository, migration, query guideline.
- AI Layer / Lớp AI: khả năng AI dùng xuyên suốt customer, nutrition, product, vision, business và marketing.

## Module Boundary / Ranh giới module

Mỗi module phải tự mô tả yêu cầu, database, API, frontend, backend, testing, status, report, decision và changelog. Không tạo phụ thuộc vòng giữa module.

