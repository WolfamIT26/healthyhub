# Branch Strategy / Chiến lược nhánh

## Main Branches / Nhánh chính

- `main`: trạng thái ổn định, có thể release.
- `develop`: nhánh tích hợp cho các thay đổi chuẩn bị release nếu team chọn workflow hai nhánh.
- `feature/*`: phát triển tính năng hoặc tài liệu mới.
- `fix/*`: sửa lỗi có phạm vi rõ.
- `docs/*`: thay đổi chỉ liên quan tài liệu.
- `release/*`: chuẩn bị release.
- `hotfix/*`: sửa lỗi khẩn cấp trên production.

## Branch Naming / Đặt tên nhánh

Tên nhánh dùng tiếng Anh, ngắn và thể hiện mục tiêu. Ví dụ: `docs/foundation-documentation`, `feature/product-catalog`, `fix/auth-token-expiry`.

## Merge Rule / Quy tắc merge

- Mọi thay đổi đáng kể phải qua Pull Request.
- PR phải liên kết issue hoặc spec nếu có.
- Không merge khi CI thất bại, trừ khi có lý do được ghi trong PR.
- Tài liệu phải được cập nhật trước khi merge.

## Related / Liên quan

- [Git Convention / Quy ước Git](git-convention.md)
- [Code Review Workflow / Quy trình review code](../development/code-review-workflow.md)

