# Development Workflow / Quy trình phát triển

## Standard Flow / Luồng chuẩn

HealthyHub dùng luồng phát triển:

Requirement -> Architecture -> Database Design -> API Design -> Frontend Design -> Backend Development -> Testing -> Review -> Documentation Update -> Release.

## Phase Rule / Quy tắc theo giai đoạn

- Requirement phải làm rõ mục tiêu, phạm vi, actor và acceptance criteria.
- Architecture phải xác định module, layer, gateway và dependency.
- Database Design chỉ thực hiện khi feature cần dữ liệu mới hoặc thay đổi dữ liệu.
- API Design chỉ thực hiện khi có giao tiếp client-server hoặc service contract.
- Frontend Design chỉ thực hiện khi có UI.
- Backend Development chỉ bắt đầu khi requirement, API và database impact đã rõ.
- Testing và documentation update là điều kiện hoàn thành, không phải việc phụ.

## AI Agent Rule / Quy tắc cho AI Agent

AI Agent phải đọc project rules, folder structure, context pack và module docs liên quan trước khi làm. Sau khi làm phải cập nhật status, report, checklist và changelog trong phạm vi bị ảnh hưởng.

## Related / Liên quan

- [AI Workflow / Quy trình AI](ai-workflow.md)
- [Module Workflow / Quy trình module](module-workflow.md)

