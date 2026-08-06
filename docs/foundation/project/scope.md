# Scope / Phạm vi

## In Scope / Trong phạm vi

Foundation Documentation bao gồm các nguyên tắc nền cho dự án:

- Tổng quan dự án và thuật ngữ.
- Kiến trúc hệ thống, layer và gateway.
- Chuẩn đặt tên, Git, commit, version và release.
- Workflow phát triển, review, tài liệu, module và AI.
- Bảo mật, hiệu năng, testing, deployment, backup và monitoring.
- Cách tổ chức AI skill, prompt, context pack và tài liệu AI.
- Cách ghi nhận quyết định kiến trúc bằng ADR.

## Out of Scope / Ngoài phạm vi

Giai đoạn này không tạo:

- Code frontend, backend, mobile hoặc shared package.
- Logic nghiệp vụ bán hàng, thanh toán, giỏ hàng, kho hoặc AI runtime.
- Thiết kế database chi tiết.
- Đặc tả API endpoint.
- Thiết kế màn hình UI cụ thể.
- Tích hợp nhà cung cấp thanh toán, lưu trữ, email, analytics hoặc AI.

## Boundary Rule / Quy tắc ranh giới

Nếu một tài liệu bắt đầu mô tả bảng dữ liệu, endpoint, component cụ thể hoặc business flow chi tiết, nội dung đó phải chuyển sang `.spec/features` hoặc tài liệu module tương ứng. Foundation chỉ giữ quy tắc chung và cách làm.

## Related / Liên quan

- [Module Workflow / Quy trình module](../development/module-workflow.md)
- [ADR Guide / Hướng dẫn ADR](../decision-record/adr-guide.md)

