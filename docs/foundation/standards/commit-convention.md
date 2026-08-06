# Commit Convention / Quy ước commit

## Format / Định dạng

Commit message dùng cấu trúc:

```text
type(scope): short description
```

## Types / Nhóm commit

| Type / Loại | Usage / Cách dùng |
| --- | --- |
| `feat` | Thêm tính năng. |
| `fix` | Sửa lỗi. |
| `docs` | Cập nhật tài liệu. |
| `chore` | Công việc vận hành, cấu hình hoặc scaffold. |
| `test` | Thêm hoặc sửa test. |
| `refactor` | Đổi cấu trúc code không đổi hành vi. |
| `perf` | Cải thiện hiệu năng. |
| `security` | Cập nhật liên quan bảo mật. |

## Message Rule / Quy tắc nội dung

- Mô tả bằng tiếng Anh ngắn gọn để lịch sử Git nhất quán.
- Body có thể dùng tiếng Việt nếu cần giải thích quyết định.
- Không dùng commit message chung chung như `update`, `fix bug`, `change files`.

## Related / Liên quan

- [Versioning Strategy / Chiến lược version](versioning-strategy.md)
- [Release Strategy / Chiến lược release](release-strategy.md)

