# Modular Monolith / Monolith module hóa

## Definition / Định nghĩa

Modular Monolith là một hệ thống triển khai chung nhưng chia module theo nghiệp vụ. Mỗi module có tài liệu, đặc tả, logic, dữ liệu và checklist riêng để tránh hệ thống biến thành một khối khó bảo trì.

## Module Boundary / Ranh giới module

Một module nên có:

- Requirement riêng.
- Database impact riêng.
- API contract riêng nếu có public endpoint.
- Frontend scope riêng nếu có UI.
- Backend scope riêng nếu có xử lý server.
- Testing checklist riêng.
- Status, report và changelog riêng.

## Communication Rule / Quy tắc giao tiếp module

Module có thể gọi nhau qua service contract nội bộ. Không cho phép truy cập dữ liệu hoặc implementation nội bộ của module khác nếu chưa có lý do rõ và chưa cập nhật tài liệu.

## Microservice Preparation / Chuẩn bị microservice

Để có thể tách module sau này:

- Giữ module ownership rõ.
- Tránh shared database logic rối giữa nhiều module.
- Ghi nhận integration contract.
- Tách gateway provider khỏi business use case.
- Có log, audit và test đủ để tách an toàn.

## Related / Liên quan

- [Module Workflow / Quy trình module](../development/module-workflow.md)
- [ADR Guide / Hướng dẫn ADR](../decision-record/adr-guide.md)

