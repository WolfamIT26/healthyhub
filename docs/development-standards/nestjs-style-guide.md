# NestJS Style Guide / Chuẩn NestJS

## Purpose / Mục tiêu

Backend HealthyHub dùng NestJS theo Modular Monolith. Mỗi module giữ ranh giới rõ để có thể tách service trong tương lai.

## Module Structure / Cấu trúc module

| Element / Thành phần | Responsibility / Trách nhiệm |
| --- | --- |
| Module | Gom controller, service, provider và dependency của một domain/module. |
| Controller | Nhận HTTP request, kiểm auth/permission ở mức route và gọi application service. |
| Service | Điều phối use case, business rule, transaction và gateway/repository. |
| Repository | Truy cập database, không chứa business rule phức tạp. |
| DTO | Đại diện request/response theo Data Contract ở phase implementation. |
| Entity/Model | Đại diện dữ liệu persistence theo database design. |
| Guard | Authentication, authorization và permission check. |
| Pipe | Validation, transform an toàn và parse input. |
| Interceptor | Trace ID, response envelope, logging hoặc cross-cutting behavior. |
| Filter | Map exception sang Error Contract. |

## Dependency Direction / Hướng phụ thuộc

- Presentation gọi business/application service.
- Business gọi repository và gateway abstraction.
- Repository truy cập database.
- Gateway adapter gọi provider bên ngoài.
- Module không import vòng lặp hoặc truy cập trực tiếp layer nội bộ không thuộc contract.

## Business Rule / Quy tắc nghiệp vụ

- Business rule quan trọng nằm ở service/domain logic, không nằm trong controller.
- Validation request và validation business phải tách rõ.
- Transaction phải bao quanh use case cần đồng bộ nhiều ghi dữ liệu.
- Idempotency cần áp dụng cho tạo đơn, payment callback, webhook hoặc action có thể gửi lại.

## Gateway Rule / Quy tắc gateway

- Business module chỉ gọi gateway interface/contract.
- Không gọi SDK provider trực tiếp trong service nghiệp vụ.
- Gateway cần timeout, retry giới hạn, error mapping, logging an toàn và fallback nếu phù hợp.

