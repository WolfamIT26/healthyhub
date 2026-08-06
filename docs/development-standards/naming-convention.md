# Naming Convention / Quy ước đặt tên

## Purpose / Mục tiêu

Naming convention thống nhất cách đặt tên trong code, database, API, tài liệu và UI để AI Agent không tạo nhiều phong cách khác nhau.

## Language Rule / Quy tắc ngôn ngữ

| Area / Khu vực | Rule / Quy tắc |
| --- | --- |
| Folder | Tiếng Anh, kebab-case nếu nhiều từ. |
| File | Tiếng Anh, rõ nghĩa, kebab-case cho Markdown và frontend files khi phù hợp. |
| Code | Tiếng Anh. |
| Comment | Tiếng Việt khi cần giải thích logic. |
| Database | Tiếng Anh, snake_case. |
| API | Tiếng Anh, REST naming. |
| UI text | Tiếng Việt. |
| Prompt | Tiếng Việt. |

## Code Naming / Đặt tên code

- Function/method dùng động từ hoặc cụm động từ.
- Class/interface/type dùng danh từ rõ nghĩa.
- Enum value dùng tên ổn định, không phụ thuộc label UI.
- Constant dùng tên thể hiện ý nghĩa, không che giấu config đáng ra lấy từ environment.

## Domain Naming / Đặt tên domain

- Tên domain bám Business Blueprint, Feature Specifications và Domain Model.
- Không tự tạo tên module mới nếu domain đã có tên chuẩn.
- Nếu tên mới cần thiết, phải cập nhật ubiquitous language hoặc decision record.

## API Naming / Đặt tên API

- URI dùng resource noun, không dùng động từ tùy tiện.
- Version theo API Specification.
- Query parameter bám Data Contract.
- Error code bám Error Catalog.

