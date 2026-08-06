# Naming Convention / Quy ước đặt tên

## Language Rule / Quy tắc ngôn ngữ

- Folder dùng tiếng Anh.
- File name dùng tiếng Anh; tài liệu nền có thể dùng numbering khi cần thứ tự đọc.
- Nội dung Markdown dùng tiếng Việt.
- Heading dùng song ngữ English + Vietnamese.
- Code naming dùng tiếng Anh.
- Comment trong code dùng tiếng Việt khi comment thật sự cần thiết.
- Database object dùng tiếng Anh.
- API path, request field và response field dùng tiếng Anh.
- UI text dùng tiếng Việt.

## Folder Naming / Đặt tên thư mục

Folder dùng `kebab-case` khi có nhiều từ, ví dụ `context-packs`, `release-notes`, `feature-specification`. Tên folder phải thể hiện vai trò, không đặt theo tên người làm hoặc trạng thái tạm thời.

## File Naming / Đặt tên file

Markdown dùng tên rõ nghĩa như `security-guideline.md`, `development-workflow.md`, `adr-guide.md`. File template có thể dùng hậu tố `template` nếu mục đích là để sao chép.

## Module Naming / Đặt tên module

Module nghiệp vụ dùng danh từ số nhiều hoặc domain rõ nghĩa: `products`, `orders`, `users`, `inventory`. Không trộn tiếng Việt trong tên module.

## Related / Liên quan

- [Coding Standard / Chuẩn code](coding-standard.md)
- [Folder Architecture / Kiến trúc thư mục](../architecture/folder-architecture.md)

