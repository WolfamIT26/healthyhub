# Branching Strategy / Chiến lược nhánh

## Purpose / Mục tiêu

Branching Strategy giúp phân biệt feature, fix, docs, refactor, security và release.

## Branch Types / Loại nhánh

| Type / Loại | Pattern / Mẫu | Usage / Cách dùng |
| --- | --- | --- |
| Feature | `feature/<scope>-<short-name>` | Tính năng mới. |
| Fix | `fix/<scope>-<short-name>` | Sửa lỗi. |
| Docs | `docs/<scope>-<short-name>` | Cập nhật tài liệu. |
| Refactor | `refactor/<scope>-<short-name>` | Refactor không đổi hành vi. |
| Security | `security/<scope>-<short-name>` | Sửa/cải thiện bảo mật. |
| Release | `release/<version>` | Chuẩn bị release. |

## Scope Rule / Quy tắc scope

Scope dùng tên module hoặc khu vực như `products`, `orders`, `api`, `web`, `database`, `ai`, `docs`.

## Protection Rule / Quy tắc bảo vệ

- Branch chính cần review trước merge.
- Không commit trực tiếp lên branch release nếu workflow dự án yêu cầu PR.
- Hotfix/security cần report rõ rủi ro và test tối thiểu.

