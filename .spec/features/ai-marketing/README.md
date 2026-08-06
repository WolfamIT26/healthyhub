# AI Marketing Feature Specification / Đặc tả tính năng AI Marketing

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Products, Blog, Promotions, Customers, AI Gateway |
| Version | Version 1.5 |
| Owner | Marketing, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Marketing hỗ trợ tạo caption, email, campaign idea và draft nội dung marketing dựa trên thông tin sản phẩm và chính sách thương hiệu.

## Business Goal / Mục tiêu kinh doanh

Tăng tốc sản xuất nội dung marketing nhưng vẫn giữ kiểm duyệt người thật trước khi xuất bản.

## Scope / Phạm vi

Trong phạm vi: draft caption, email, blog idea, campaign brief, nội dung ưu đãi. Ngoài phạm vi: tự động gửi campaign, tự động xuất bản, claim y tế không kiểm chứng.

## Requirement / Yêu cầu

- AI content phải được review trước khi public.
- Nội dung không được sai thông tin sản phẩm.
- Không dùng dữ liệu khách cá nhân nếu chưa có policy.
- Claim sức khỏe phải cẩn trọng và có giới hạn.

## User Story / User story

- Là Marketing, tôi muốn AI gợi ý caption cho sản phẩm mới.
- Là Manager, tôi muốn review nội dung trước khi xuất bản.
- Là Admin, tôi muốn kiểm soát phạm vi dữ liệu AI dùng.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Generate caption draft | Marketing | Có draft caption để chỉnh sửa. |
| Generate email draft | Marketing | Có nội dung email nháp. |
| Generate campaign idea | Marketing, Manager | Có ý tưởng chiến dịch. |
| Approve content | Manager | Nội dung được duyệt trước public. |

## Business Flow / Luồng nghiệp vụ

1. Marketing chọn mục tiêu nội dung.
2. AI lấy context sản phẩm/chính sách được duyệt.
3. AI tạo draft.
4. Marketing chỉnh sửa.
5. Manager/Admin duyệt nếu cần.
6. Nội dung được xuất bản bằng công cụ tương ứng sau này.

## Validation Rule / Quy tắc validation

- AI draft không được public tự động.
- Không tạo claim y tế sai lệch.
- Không dùng dữ liệu cá nhân ngoài policy.
- Nội dung phải phù hợp giọng thương hiệu tiếng Việt.

## Permission / Phân quyền

Marketing tạo draft. Manager/Admin duyệt. Staff không xuất bản campaign. AI không tự gửi notification/email.

## Acceptance Criteria / Tiêu chí hoàn thành

- AI tạo được draft marketing theo context.
- Có bước review người thật.
- Nội dung không vượt chính sách sản phẩm/health claim.
- Không tự động gửi hoặc public.

## Edge Cases / Trường hợp biên

- Sản phẩm có cảnh báo dị ứng.
- Campaign cho VIP Customer.
- AI viết quá quảng cáo hoặc sai tone.

## Error Cases / Trường hợp lỗi

- Thiếu context sản phẩm.
- Draft chứa claim sai.
- Người dùng không đủ quyền tạo/duyệt.

## Future Enhancement / Mở rộng tương lai

- Brand voice tuning.
- Campaign performance feedback loop.
- AI email personalization có consent.

