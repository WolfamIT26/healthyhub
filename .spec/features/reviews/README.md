# Reviews Feature Specification / Đặc tả tính năng đánh giá

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Products, Customers, Orders |
| Version | Version 1 |
| Owner | Product Owner, Customer Success |
| Status | Draft for business specification |

## Overview / Tổng quan

Reviews thu thập đánh giá sản phẩm từ khách hàng để tăng độ tin cậy và cải thiện chất lượng bán hàng.

## Business Goal / Mục tiêu kinh doanh

Tăng niềm tin khi mua sản phẩm healthy và tạo dữ liệu phản hồi cho Product AI/Review Summary sau này.

## Scope / Phạm vi

Trong phạm vi: đánh giá sản phẩm, nội dung review, kiểm duyệt, trạng thái hiển thị. Ngoài phạm vi: database review, API review, UI review component.

## Requirement / Yêu cầu

- Customer có trải nghiệm mua hợp lệ được ưu tiên đánh giá.
- Review vi phạm chính sách phải được kiểm duyệt.
- Review public không được chỉnh sửa làm sai ý kiến khách.
- Product page có thể hiển thị review hợp lệ.

## User Story / User story

- Là Customer, tôi muốn đánh giá sản phẩm sau khi mua.
- Là Guest, tôi muốn đọc review để quyết định mua.
- Là Manager, tôi muốn ẩn review vi phạm chính sách.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Submit review | Customer | Review được ghi nhận. |
| Moderate review | Manager, Admin | Review được duyệt/ẩn theo policy. |
| View reviews | Guest, Customer | Khách xem phản hồi hợp lệ. |

## Business Flow / Luồng nghiệp vụ

1. Customer mua hoặc nhận sản phẩm.
2. Customer gửi đánh giá.
3. Hệ thống kiểm tra nội dung theo policy.
4. Review được hiển thị hoặc chờ duyệt.
5. Manager xử lý review vi phạm.

## Validation Rule / Quy tắc validation

- Review phải gắn với sản phẩm hợp lệ.
- Nội dung review không được vi phạm policy.
- Rating nếu có phải nằm trong thang hợp lệ.
- Khách không spam nhiều review trùng lặp.

## Permission / Phân quyền

Guest xem review public. Customer tạo review. Manager/Admin kiểm duyệt. Staff chỉ hỗ trợ theo policy.

## Acceptance Criteria / Tiêu chí hoàn thành

- Customer gửi review theo rule.
- Review public hợp lệ được hiển thị.
- Review vi phạm có thể bị ẩn.
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

- Verified purchase badge.
- Review photo.
- AI review summary.

