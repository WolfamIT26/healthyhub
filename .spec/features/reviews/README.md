# Reviews Feature Specification / Đặc tả tính năng đánh giá

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Products, Customers, Orders |
| Version | Version 1 |
| Owner | Product Owner, Customer Success |
| Status | Reviews & Ratings V1 public/customer runtime READY |

## Overview / Tổng quan

Reviews thu thập đánh giá sản phẩm từ khách hàng để tăng độ tin cậy và cải thiện chất lượng bán hàng.

## Prompt 33 executable audit / Audit executable Prompt 33

Customer ownership, persisted Order Item/Product relation và authoritative Order `completed` + Shipment `delivered` evidence đã executable cho COD/VNPAY. Internal eligibility policy fail closed khi owner/Product evidence thiếu hoặc fulfillment cancelled/returned.

Prompt 33.2 reuse contract này để triển khai Review persistence, public/customer API, rating aggregate và Product Detail UI. Không dùng OrderPlaced, Payment paid, Order confirmed, stock consumed, Cart hoặc Wishlist để thay thế delivered evidence.

## Business Goal / Mục tiêu kinh doanh

Tăng niềm tin khi mua sản phẩm healthy và tạo dữ liệu phản hồi cho Product AI/Review Summary sau này.

## Scope / Phạm vi

Trong phạm vi: persisted rating/content, published public list/aggregate, verified badge, owner create/edit/soft-delete và Product Detail UI. Ngoài phạm vi Prompt 33.2: Admin moderation UI/API, report, media, voting, comments, replies, rewards và AI moderation.

## Requirement / Yêu cầu

- Customer có trải nghiệm mua hợp lệ được ưu tiên đánh giá.
- Admin moderation cho Review vi phạm là future scope, không phải V1 runtime này.
- Review public không được chỉnh sửa làm sai ý kiến khách.
- Product page có thể hiển thị review hợp lệ.

## User Story / User story

- Là Customer, tôi muốn đánh giá sản phẩm sau khi mua.
- Là Guest, tôi muốn đọc review để quyết định mua.
- Future: là Manager, tôi muốn ẩn review vi phạm chính sách.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Submit review | Customer | Review được ghi nhận. |
| Moderate review | Manager, Admin | Future scope; chưa executable trong Prompt 33.2. |
| View reviews | Guest, Customer | Khách xem phản hồi hợp lệ. |

## Business Flow / Luồng nghiệp vụ

1. Authoritative Order/Shipment lifecycle xác nhận Customer đã nhận/hoàn tất Product.
2. Customer gửi đánh giá.
3. Hệ thống recheck eligibility trong locked transaction và lưu Review published.
4. Public list/aggregate đọc Review active/published.
5. Full return giữ content nhưng revoke verified badge.

## Validation Rule / Quy tắc validation

- Review phải gắn với sản phẩm hợp lệ.
- Nội dung review không được vi phạm policy.
- Rating nếu có phải nằm trong thang hợp lệ.
- Khách không spam nhiều review trùng lặp.

## Permission / Phân quyền

Guest xem review published. Customer tạo/sửa/xóa mềm Review của mình. Manager/Admin moderation là future scope.

## Acceptance Criteria / Tiêu chí hoàn thành

- Customer gửi review theo rule.
- Review public hợp lệ được hiển thị.
- Public/customer boundary không expose Admin moderation giả.
- Product review sẵn sàng cho AI summary sau này.

## Edge Cases / Trường hợp biên

- Khách sửa review sau khi gửi.
- Review sản phẩm đã ngừng bán.
- Review tiêu cực nhưng không vi phạm.

## Error Cases / Trường hợp lỗi

- Nội dung review rỗng hoặc spam.
- Người dùng không đủ điều kiện review.
- Review bị báo cáo vi phạm.

## Future Enhancement / Mở rộng tương lai

- Admin moderation/reporting.
- Review photo.
- AI review summary.
