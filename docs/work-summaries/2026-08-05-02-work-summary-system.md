# Work Summary System / Hệ thống file tổng hợp sau mỗi lần làm

## Task / Nhiệm vụ

Thiết lập quy ước để sau mỗi lần AI Agent làm xong đều tạo một file tổng hợp, gom chung vào một thư mục.

## Summary / Tóm tắt

Đã tạo thư mục `docs/work-summaries` để lưu toàn bộ file tổng hợp sau mỗi nhiệm vụ. Đồng thời cập nhật project rules và AI mandatory rules để các lần sau tự động ghi summary vào thư mục này.

## Added / Đã thêm

- `docs/work-summaries/README.md`: hướng dẫn mục đích, cách đặt tên và nội dung bắt buộc của file tổng hợp.
- `docs/work-summaries/2026-08-05-01-prompt-03-foundation-documentation.md`: bản tổng hợp cho Prompt 03 vừa hoàn thành.
- `docs/work-summaries/2026-08-05-02-work-summary-system.md`: bản tổng hợp cho việc thiết lập hệ thống summary.

## Updated / Đã cập nhật

- `docs/00-project-rules.md`: thêm quy tắc tạo file tổng hợp sau khi làm.
- `.ai/rules/00-agent-mandatory-rules.md`: thêm yêu cầu tạo work summary.
- `docs/README.md`: thêm mục Work Summaries vào chỉ mục.
- `README.md`: thêm link nhanh tới Work Summaries.
- `CHANGELOG.md`: ghi nhận hệ thống summary.

## Not Changed / Không thay đổi

- Không thay đổi source code.
- Không thay đổi stack.
- Không tạo nghiệp vụ, database, API, frontend hoặc backend.

## Verification / Kiểm tra

- Đã chạy `git diff --check`, kết quả sạch.
- Đã chạy `rg --files docs/work-summaries | sort` để xác nhận các file tổng hợp đã nằm đúng thư mục.

## Notes / Ghi chú

Các lần sau, sau khi hoàn thành task, AI Agent nên tạo file mới theo dạng `YYYY-MM-DD-NN-short-task-name.md` trong `docs/work-summaries`.
