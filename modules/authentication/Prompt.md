# Prompt / Hướng dẫn cho prompt triển khai tiếp theo

## Required Reading / Đọc bắt buộc

Đọc `modules/authentication/README.md` theo reading order, sau đó chỉ đọc input files của task tương ứng trong `ImplementationPlan.md`. Đọc Security Rules và approved upstream changes. Không đọc lại toàn repository.

## Execution Rule / Quy tắc thực thi

- Chỉ thực hiện một task hoặc nhóm dependency liền kề được người dùng yêu cầu.
- Không code khi `Status.md` còn P0 blocker liên quan task.
- Không tự quyết policy/security value, secret, database field hoặc API shape còn pending.
- Giữ ownership Authentication/User/Notification và reuse Implementation Foundation.
- Chỉ sửa file allowlist của task; cập nhật module governance và work summary.
- Chạy acceptance/verification command của task và báo rõ lệnh chưa thể chạy.

## Handoff Format / Định dạng bàn giao

Nêu outcome, files changed, tests/checks, contract/security decisions applied, unresolved blockers và task kế tiếp; không đưa credential/token mẫu thật.
