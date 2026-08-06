# AI Code Generation Rules / Quy tắc AI sinh code

## Purpose / Mục tiêu

Tài liệu này quy định cách Codex và AI Agent sinh code HealthyHub ở các prompt sau để không phá cấu trúc, không lệch stack và không bỏ sót tài liệu.

## Before Coding / Trước khi code

- Chỉ đọc context cần thiết.
- Không quét toàn bộ repository khi không cần.
- Đọc context pack/module specification liên quan.
- Kiểm tra Data Contract, API Specification, UI Contract và Design System nếu task liên quan.
- Kiểm tra dependency hiện tại trước khi đề xuất package mới.

## During Coding / Trong khi code

- Không tự đổi architecture, stack, API hoặc database.
- Không tạo dependency mới nếu chưa có lý do và chưa kiểm tra.
- Không viết lại file không liên quan.
- Không xóa code đang hoạt động nếu chưa chứng minh cần thiết.
- Ưu tiên chỉnh sửa nhỏ, có kiểm soát.
- Business logic đặt đúng layer.
- Gateway provider chỉ gọi qua gateway abstraction.

## Before Final / Trước khi hoàn thành

- Tự review diff.
- Chạy validation, lint, test và build phù hợp.
- Báo rõ file tạo, file sửa, test đã chạy và phần chưa hoàn thành.
- Cập nhật Status, Report, Checklist, ChangeLog và tài liệu liên quan.
- Không báo module hoàn thành nếu còn Critical hoặc High.

## Prohibited / Không được làm

- Không commit secret hoặc log dữ liệu nhạy cảm.
- Không tạo endpoint/migration/UI ngoài specification khi chưa cập nhật tài liệu.
- Không tự ý thêm framework chính.
- Không bỏ qua lỗi test quan trọng.

