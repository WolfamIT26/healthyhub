# Analytics Feature Specification / Đặc tả tính năng phân tích

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Orders, Products, Inventory, Customers, Promotions, AI Analytics |
| Version | Version 1.5 |
| Owner | Manager, Business Analyst |
| Status | Draft for business specification |

## Overview / Tổng quan

Analytics tổng hợp dữ liệu vận hành để giúp manager hiểu doanh số, khách hàng, tồn kho, marketing và hiệu quả AI.

## Business Goal / Mục tiêu kinh doanh

Hỗ trợ ra quyết định kinh doanh dựa trên dữ liệu thay vì cảm tính.

## Scope / Phạm vi

Trong phạm vi: chỉ số kinh doanh, phân tích đơn hàng, sản phẩm, tồn kho, khách hàng, promotion, AI insight. Ngoài phạm vi: database warehouse, tracking API, dashboard UI.

## Requirement / Yêu cầu

- Manager xem được chỉ số kinh doanh quan trọng.
- Analytics không sửa dữ liệu vận hành.
- Dữ liệu cá nhân cần giảm thiểu hoặc ẩn danh khi phù hợp.
- AI Analytics chỉ đề xuất, không tự quyết định.

## User Story / User story

- Là Manager, tôi muốn xem doanh số và sản phẩm bán chạy.
- Là Marketing, tôi muốn biết promotion nào hiệu quả.
- Là Admin, tôi muốn theo dõi hoạt động AI ở mức tổng quan.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| View sales summary | Manager | Nắm doanh số. |
| View inventory insight | Manager | Biết sản phẩm cần chú ý. |
| View campaign performance | Marketing | Đánh giá chiến dịch. |
| View AI insight | Manager | Nhận gợi ý vận hành. |

## Business Flow / Luồng nghiệp vụ

1. Dữ liệu vận hành phát sinh từ orders/products/customers.
2. Analytics tổng hợp chỉ số theo phạm vi.
3. Manager xem báo cáo.
4. AI Analytics có thể gợi ý insight.
5. Manager quyết định hành động kinh doanh.

## Validation Rule / Quy tắc validation

- Báo cáo phải nêu phạm vi dữ liệu.
- Dữ liệu cá nhân cần kiểm soát quyền.
- AI insight cần ghi rõ là đề xuất.
- Analytics không thay đổi đơn hàng hoặc tồn kho.

## Permission / Phân quyền

Staff xem giới hạn. Manager/Admin xem analytics cửa hàng. Super Admin xem cấp nền tảng khi SaaS. Marketing xem campaign metrics theo quyền.

## Acceptance Criteria / Tiêu chí hoàn thành

- Analytics có chỉ số doanh số, sản phẩm, khách hàng, tồn kho.
- Permission xem báo cáo rõ.
- AI insight không thay thế quyết định manager.
- Dữ liệu nhạy cảm được kiểm soát.

## Edge Cases / Trường hợp biên

- Dữ liệu thiếu trong giai đoạn mới vận hành.
- Đơn bị hủy ảnh hưởng doanh số.
- Promotion chồng lấn nhiều chiến dịch.

## Error Cases / Trường hợp lỗi

- Dữ liệu nguồn không đủ.
- Người dùng không đủ quyền xem.
- AI insight thiếu độ tin cậy.

## Future Enhancement / Mở rộng tương lai

- Advanced dashboard.
- Forecasting.
- SaaS tenant analytics.
- AI anomaly detection.

