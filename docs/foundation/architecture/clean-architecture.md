# Clean Architecture / Kiến trúc sạch

## Principle / Nguyên tắc

Clean Architecture trong HealthyHub dùng để bảo vệ business logic khỏi phụ thuộc trực tiếp vào framework, database, UI hoặc provider bên ngoài. Dependency phải đi từ lớp ngoài vào lớp trong thông qua interface hoặc contract rõ ràng.

## Dependency Direction / Hướng phụ thuộc

- Presentation gọi Business thông qua use case hoặc service contract.
- Business không phụ thuộc trực tiếp vào implementation của database, AI provider, payment provider hoặc storage provider.
- Data và Gateway triển khai contract được Business sử dụng.
- AI capability phải đi qua AI Layer hoặc AI Gateway thay vì gọi provider rải rác.

## Boundary Rule / Quy tắc ranh giới

Mỗi module phải giữ ranh giới rõ:

- Không truy cập database table của module khác nếu chưa có contract.
- Không gọi trực tiếp provider bên ngoài trong business logic.
- Không đưa rule nghiệp vụ vào UI component.
- Không đưa logic trình bày vào service backend.

## Practical Standard / Chuẩn áp dụng thực tế

HealthyHub không bắt buộc tạo quá nhiều tầng trừu tượng khi chưa có code. Khi triển khai, chỉ thêm abstraction nếu nó bảo vệ ranh giới module, giảm phụ thuộc provider hoặc làm kiểm thử dễ hơn.

## Related / Liên quan

- [Layer Architecture / Kiến trúc phân lớp](layer-architecture.md)
- [Coding Standard / Chuẩn code](../standards/coding-standard.md)

