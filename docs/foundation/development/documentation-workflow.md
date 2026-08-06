# Documentation Workflow / Quy trình tài liệu

## Principle / Nguyên tắc

Tài liệu phải đi cùng thay đổi. Nếu code, cấu trúc, workflow hoặc quyết định thay đổi nhưng tài liệu không đổi, reviewer phải yêu cầu giải thích hoặc cập nhật.

## Documentation Levels / Cấp tài liệu

- Foundation Documentation: nguyên tắc nền trong `docs/foundation`.
- Framework Documentation: scaffold, inventory và audit trong `docs`.
- Module Documentation: tài liệu theo module trong `docs/modules` hoặc `modules`.
- Feature Specification: đặc tả tính năng trong `.spec/features`.
- AI Documentation: rule, prompt, skill, context và memory trong `.ai`.

## Update Rule / Quy tắc cập nhật

- Đổi architecture: cập nhật architecture docs hoặc ADR.
- Đổi database: cập nhật database docs và migration note.
- Đổi API: cập nhật API docs và collection liên quan.
- Đổi AI behavior: cập nhật prompt, context pack và AI documentation.
- Đổi security: cập nhật security guideline, checklist hoặc policy.

## Quality Rule / Quy tắc chất lượng

Tài liệu phải có mục tiêu, phạm vi, quy tắc áp dụng và liên kết liên quan. Không để nội dung mơ hồ khiến AI Agent phải đoán.

## Related / Liên quan

- [AI Documentation Guide / Hướng dẫn tài liệu AI](../ai/ai-documentation-guide.md)
- [ADR Guide / Hướng dẫn ADR](../decision-record/adr-guide.md)

