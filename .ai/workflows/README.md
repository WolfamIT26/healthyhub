# AI Workflows / Quy trình AI

## Purpose / Mục tiêu

Thư mục `workflows` định nghĩa các luồng làm việc chuẩn cho AI Agent. Mỗi workflow nêu rõ khi nào dùng, cần đọc tài liệu nào, tạo đầu ra nào và phải cập nhật file nào sau khi hoàn thành.

## Workflow List / Danh sách workflow

- [Generate Workflow / Quy trình sinh mới](generate-workflow.md)
- [Review Workflow / Quy trình review](review-workflow.md)
- [Refactor Workflow / Quy trình refactor](refactor-workflow.md)
- [Audit Workflow / Quy trình audit](audit-workflow.md)
- [Testing Workflow / Quy trình kiểm thử](testing-workflow.md)
- [Documentation Workflow / Quy trình tài liệu](documentation-workflow.md)
- [Release Workflow / Quy trình release](release-workflow.md)

## Mandatory Rule / Quy tắc bắt buộc

AI Agent chỉ chọn workflow phù hợp với nhiệm vụ. Nếu prompt nói không sửa file, agent dùng workflow review hoặc audit và không tạo thay đổi.

