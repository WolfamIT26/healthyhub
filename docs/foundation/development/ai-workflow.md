# AI Workflow / Quy trình AI

## Before Work / Trước khi làm

AI Agent phải đọc:

1. `docs/00-project-rules.md`.
2. `docs/01-folder-structure.md`.
3. `docs/foundation/README.md`.
4. `.ai/context/README.md`.
5. Context pack hoặc module docs liên quan.

## During Work / Trong khi làm

- Giữ đúng phạm vi prompt.
- Không tạo code nếu prompt chỉ yêu cầu tài liệu hoặc scaffold.
- Không thêm công nghệ mới khi chưa có ADR.
- Ghi rõ assumption nếu thiếu thông tin.
- Không tạo file trùng; nếu nội dung tương đương thì cập nhật hoặc mapping.

## After Work / Sau khi làm

AI Agent phải cập nhật các file trạng thái trong phạm vi phù hợp:

- `Status.md`.
- `Report.md`.
- `Checklist.md`.
- `ChangeLog.md`.

Nếu thay đổi chạm database, API, architecture, security hoặc AI behavior, phải cập nhật tài liệu tương ứng.

## Review Rule / Quy tắc review AI output

Output của AI phải được kiểm tra theo rủi ro: càng gần dữ liệu khách hàng, thanh toán, sức khỏe hoặc bảo mật thì càng cần reviewer người thật và test rõ.

## Related / Liên quan

- [Context Pack Guide / Hướng dẫn context pack](../ai/context-pack-guide.md)
- [AI Skill Overview / Tổng quan AI skill](../ai/ai-skill-overview.md)

