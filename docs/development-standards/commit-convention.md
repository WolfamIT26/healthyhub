# Commit Convention / Quy ước commit

## Purpose / Mục tiêu

Commit Convention giúp lịch sử Git dễ đọc, hỗ trợ changelog và review.

## Commit Types / Loại commit

| Type / Loại | Usage / Cách dùng |
| --- | --- |
| `feat` | Thêm tính năng. |
| `fix` | Sửa lỗi. |
| `docs` | Cập nhật tài liệu. |
| `refactor` | Đổi cấu trúc code không đổi hành vi. |
| `test` | Thêm/sửa test. |
| `chore` | Việc hạ tầng/cấu hình nhỏ. |
| `security` | Thay đổi bảo mật. |
| `perf` | Tối ưu hiệu năng. |
| `release` | Chuẩn bị phát hành. |

## Message Rule / Quy tắc message

- Dùng scope rõ nếu có.
- Mô tả ngắn gọn mục tiêu thay đổi.
- Không ghi nội dung mơ hồ như update file nếu không nói update gì.
- Không ghi secret hoặc thông tin nhạy cảm trong commit message.

## Change Boundary / Ranh giới thay đổi

Một commit nên có một mục đích. Nếu vừa đổi API, database và UI cho một vertical slice thì cần đảm bảo tài liệu liên quan được cập nhật trong cùng PR hoặc cùng chuỗi commit rõ ràng.

