# AI Analytics Feature Specification / Đặc tả tính năng AI Analytics

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Analytics, Orders, Products, Inventory, Customers, AI Gateway |
| Version | Version 1.5 |
| Owner | Manager, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Analytics diễn giải dữ liệu kinh doanh và gợi ý insight về doanh số, tồn kho, khách hàng, marketing và hiệu quả AI.

## Business Goal / Mục tiêu kinh doanh

Giúp manager phát hiện cơ hội hoặc rủi ro nhanh hơn mà không cần phân tích thủ công quá nhiều.

## Scope / Phạm vi

Trong phạm vi: insight gợi ý, tóm tắt báo cáo, cảnh báo bất thường ở mức tham khảo. Ngoài phạm vi: tự động thay đổi giá, tự động đặt hàng nhập kho, quyết định thay manager.

## Requirement / Yêu cầu

- AI insight phải ghi rõ là đề xuất.
- Manager là người quyết định hành động.
- Dữ liệu cá nhân cần được giảm thiểu.
- AI phải nêu giới hạn nếu dữ liệu ít hoặc không chắc chắn.

## User Story / User story

- Là Manager, tôi muốn AI tóm tắt tình hình kinh doanh.
- Là Marketing, tôi muốn biết campaign nào có dấu hiệu tốt.
- Là Admin, tôi muốn theo dõi AI usage ở mức tổng quan.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Summarize sales | Manager | Có tóm tắt doanh số. |
| Detect low stock risk | Manager | Nhận gợi ý chú ý tồn kho. |
| Analyze campaign | Marketing | Có insight chiến dịch. |

## Business Flow / Luồng nghiệp vụ

1. Analytics chuẩn bị dữ liệu tổng hợp.
2. AI nhận dữ liệu trong phạm vi được phép.
3. AI tạo insight và mức tin cậy.
4. Manager/Marketing xem và quyết định hành động.
5. Insight được ghi nhận để review chất lượng sau này.

## Validation Rule / Quy tắc validation

- Không dùng dữ liệu cá nhân ngoài phạm vi.
- Không tự động quyết định hành động.
- Insight phải nêu dữ liệu dựa vào.
- Thiếu dữ liệu phải fallback.

## Permission / Phân quyền

Manager/Admin xem AI Analytics. Marketing xem campaign insight theo quyền. Staff chỉ xem giới hạn. Super Admin xem nền tảng khi SaaS.

## Acceptance Criteria / Tiêu chí hoàn thành

- AI tạo insight từ analytics hợp lệ.
- Insight có giới hạn và không tự quyết định.
- Quyền xem dữ liệu rõ.
- Có fallback khi dữ liệu không đủ.

## Edge Cases / Trường hợp biên

- Dữ liệu mới quá ít.
- Đơn hủy làm lệch doanh số.
- Campaign chồng lấn.
- AI phát hiện bất thường giả.

## Error Cases / Trường hợp lỗi

- Dữ liệu nguồn thiếu.
- AI output không giải thích được.
- Người dùng không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Forecasting.
- AI anomaly detection.
- Automated report summary schedule.

