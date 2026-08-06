# Categories Feature Specification / Đặc tả tính năng danh mục

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Products |
| Version | MVP |
| Owner | Product Owner, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Categories phân loại sản phẩm để khách dễ tìm và cửa hàng dễ tổ chức danh mục bán hàng.

## Business Goal / Mục tiêu kinh doanh

Giảm ma sát tìm kiếm sản phẩm và giúp danh mục healthy rõ ràng như sữa hạt, sữa chua, đồ ăn dinh dưỡng, thực phẩm sức khỏe.

## Scope / Phạm vi

Trong phạm vi: danh mục chính, trạng thái hiển thị, thứ tự ưu tiên, gắn sản phẩm. Ngoài phạm vi: cấu trúc database category, API lọc danh mục, giao diện menu.

## Requirement / Yêu cầu

- Category phải có tên dễ hiểu bằng tiếng Việt cho UI.
- Category không được trùng nghĩa gây rối.
- Sản phẩm công khai cần thuộc category phù hợp.
- Manager/Admin có thể quản lý category.

## User Story / User story

- Là Guest, tôi muốn lọc sản phẩm theo danh mục.
- Là Customer, tôi muốn hiểu nhóm sản phẩm phù hợp nhu cầu.
- Là Manager, tôi muốn tổ chức danh mục bán hàng rõ.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Browse by category | Guest, Customer | Khách xem sản phẩm theo nhóm. |
| Manage category | Manager, Admin | Danh mục được tạo/cập nhật. |
| Assign product category | Manager, Admin | Sản phẩm thuộc nhóm phù hợp. |

## Business Flow / Luồng nghiệp vụ

1. Manager tạo hoặc cập nhật category.
2. Hệ thống kiểm tra tên và trạng thái category.
3. Manager gắn sản phẩm vào category.
4. Khách duyệt sản phẩm theo category công khai.

## Validation Rule / Quy tắc validation

- Category public phải có tên.
- Không tạo category trùng ý nghĩa với category đang dùng.
- Category bị ẩn không nên xuất hiện trong điều hướng public.

## Permission / Phân quyền

Guest/Customer xem category public. Manager/Admin quản lý category. Staff chỉ xem khi vận hành.

## Acceptance Criteria / Tiêu chí hoàn thành

- Category giúp khách tìm sản phẩm dễ hơn.
- Sản phẩm public có category chính.
- Category không trùng nghĩa.
- Category có trạng thái hiển thị rõ.

## Edge Cases / Trường hợp biên

- Category không còn sản phẩm.
- Sản phẩm thuộc nhiều category.
- Đổi tên category đang có link SEO tương lai.

## Error Cases / Trường hợp lỗi

- Tên category rỗng.
- Category trùng.
- Người thao tác không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Category tree nhiều cấp.
- SEO landing page cho category.
- AI category suggestion.

