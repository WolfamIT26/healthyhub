# Module Workflow / Quy trình module

## Purpose / Mục tiêu

Module Workflow giúp mỗi nghiệp vụ được quản lý độc lập với source code. Tài liệu module là nơi thống nhất requirement, database impact, API, frontend, backend, testing, checklist, prompt, status, report, changelog, decision và TODO.

## Required Module Documents / Tài liệu module bắt buộc

- `README.md`
- `Requirement.md`
- `Database.md`
- `API.md`
- `Frontend.md`
- `Backend.md`
- `Testing.md`
- `Checklist.md`
- `Prompt.md`
- `Status.md`
- `Report.md`
- `ChangeLog.md`
- `Decision.md`
- `TODO.md`

## Module Lifecycle / Vòng đời module

1. Khởi tạo module docs từ template.
2. Viết requirement và scope.
3. Xác định architecture impact.
4. Thiết kế database/API/UI/backend nếu cần.
5. Tạo checklist test và acceptance criteria.
6. Triển khai trong source code khi được phép.
7. Review, cập nhật report và changelog.

## Boundary Rule / Quy tắc ranh giới

Module không được tự ý phụ thuộc implementation nội bộ của module khác. Nếu cần giao tiếp liên module, phải ghi contract và cập nhật decision.

## Related / Liên quan

- [Modular Monolith / Monolith module hóa](../architecture/modular-monolith.md)
- [Documentation Workflow / Quy trình tài liệu](documentation-workflow.md)

