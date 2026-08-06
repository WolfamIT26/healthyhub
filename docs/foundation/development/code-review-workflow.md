# Code Review Workflow / Quy trình review code

## Purpose / Mục tiêu

Code review bảo vệ chất lượng sản phẩm, ranh giới kiến trúc và khả năng bảo trì. Review không chỉ nhìn style mà phải kiểm tra hành vi, dữ liệu, bảo mật, test và tài liệu.

## Review Checklist / Checklist review

- Requirement đã được đáp ứng đúng phạm vi.
- Module boundary không bị phá vỡ.
- Business logic không nằm sai layer.
- Input validation và error handling đầy đủ.
- Không lộ secret hoặc dữ liệu nhạy cảm.
- Test phù hợp với mức rủi ro.
- Tài liệu bị ảnh hưởng đã cập nhật.
- Changelog hoặc report đã ghi thay đổi.

## AI-assisted Review / Review có AI hỗ trợ

AI Reviewer phải đọc diff, tài liệu liên quan và checklist trước khi kết luận. Output review phải ưu tiên finding có file/line cụ thể, mức độ nghiêm trọng và lý do kỹ thuật.

## Approval Rule / Quy tắc duyệt

Không duyệt thay đổi nếu còn lỗi bảo mật nghiêm trọng, thiếu migration plan cho thay đổi dữ liệu, thiếu test cho luồng quan trọng hoặc thiếu tài liệu bắt buộc.

## Related / Liên quan

- [Git Convention / Quy ước Git](../standards/git-convention.md)
- [Testing Strategy / Chiến lược kiểm thử](../testing/testing-strategy.md)

