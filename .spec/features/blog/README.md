# Blog Feature Specification / Đặc tả tính năng blog nội dung

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Media, SEO, AI Marketing |
| Version | Version 1 |
| Owner | Marketing, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Blog quản lý nội dung healthy lifestyle, kiến thức sản phẩm và bài viết hỗ trợ SEO.

## Business Goal / Mục tiêu kinh doanh

Giáo dục khách hàng, tăng traffic tự nhiên và hỗ trợ niềm tin khi mua sản phẩm healthy.

## Scope / Phạm vi

Trong phạm vi: bài viết, trạng thái xuất bản, nội dung SEO cơ bản, media bài viết. Ngoài phạm vi: CMS kỹ thuật, API blog, UI blog, medical advice.

## Requirement / Yêu cầu

- Bài viết phải có tiêu đề, nội dung và trạng thái.
- Nội dung không được thay thế tư vấn y tế.
- Marketing/Manager quản lý lịch xuất bản.
- AI Marketing có thể hỗ trợ draft nhưng cần review người thật.

## User Story / User story

- Là Guest, tôi muốn đọc kiến thức healthy dễ hiểu.
- Là Customer, tôi muốn hiểu cách dùng sản phẩm.
- Là Marketing, tôi muốn xuất bản nội dung hỗ trợ SEO.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Read blog | Guest, Customer | Người dùng đọc nội dung public. |
| Draft article | Marketing | Bài viết ở trạng thái nháp. |
| Publish article | Manager, Admin | Bài viết public. |

## Business Flow / Luồng nghiệp vụ

1. Marketing tạo nội dung nháp.
2. Nội dung được kiểm tra claim và SEO.
3. Manager/Admin duyệt xuất bản nếu cần.
4. Bài viết hiển thị public.
5. Analytics đo hiệu quả nội dung sau này.

## Validation Rule / Quy tắc validation

- Bài public không được thiếu tiêu đề.
- Nội dung sức khỏe cần disclaimer phù hợp.
- AI-generated content phải được review trước khi xuất bản.
- SEO không được nhồi từ khóa.

## Permission / Phân quyền

Guest/Customer đọc blog public. Marketing tạo nháp. Manager/Admin xuất bản hoặc ẩn bài.

## Acceptance Criteria / Tiêu chí hoàn thành

- Blog có quy trình nháp/xuất bản.
- Nội dung không chứa lời khuyên y tế sai lệch.
- Media dùng đúng quyền.
- Bài viết hỗ trợ SEO ở mức nghiệp vụ.

## Edge Cases / Trường hợp biên

- Bài viết liên quan sản phẩm đã ngừng bán.
- Nội dung cần cập nhật theo chính sách mới.
- AI draft có thông tin chưa kiểm chứng.

## Error Cases / Trường hợp lỗi

- Bài public thiếu nội dung.
- Người dùng không đủ quyền xuất bản.
- Nội dung vi phạm policy.

## Future Enhancement / Mở rộng tương lai

- Editorial workflow.
- AI content optimization.
- Topic cluster SEO.

