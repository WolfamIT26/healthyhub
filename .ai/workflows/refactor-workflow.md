# Refactor Workflow / Quy trình refactor

## When to Use / Khi sử dụng

Dùng khi nhiệm vụ yêu cầu cải thiện cấu trúc tài liệu, template hoặc code sau này mà không đổi hành vi.

## Required Reading / Tài liệu cần đọc

- Tài liệu hoặc file cần refactor.
- Foundation architecture và standards.
- Rule naming, documentation, coding nếu có code.
- Checklist review tương ứng.

## Steps / Các bước

1. Xác định mục tiêu refactor và hành vi cần giữ nguyên.
2. Kiểm tra ranh giới module hoặc tài liệu liên quan.
3. Thực hiện thay đổi nhỏ, dễ review.
4. Cập nhật tài liệu nếu cấu trúc hoặc rule thay đổi.
5. Ghi rõ phần không đổi trong report.

## Boundary Rule / Quy tắc ranh giới

Không dùng refactor để lén thêm nghiệp vụ, đổi stack hoặc thay đổi quyết định kiến trúc chưa có ADR.

