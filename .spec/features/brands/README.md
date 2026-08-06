# Brands Feature Specification / Đặc tả tính năng thương hiệu

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Products, Media |
| Version | MVP |
| Owner | Product Owner, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Brands quản lý thương hiệu hoặc nhà sản xuất gắn với sản phẩm healthy.

## Business Goal / Mục tiêu kinh doanh

Tăng độ tin cậy sản phẩm, hỗ trợ lọc/tìm kiếm và giúp khách nhận biết nguồn gốc thương hiệu.

## Scope / Phạm vi

Trong phạm vi: tên thương hiệu, mô tả, trạng thái, liên kết sản phẩm, thông tin chứng nhận nếu có. Ngoài phạm vi: database brand schema, API brand, UI brand page.

## Requirement / Yêu cầu

- Brand phải có tên rõ ràng trước khi gắn vào sản phẩm.
- Brand public không được gây hiểu nhầm nguồn gốc.
- Manager/Admin có thể quản lý brand.
- Chứng nhận liên quan brand cần kiểm soát media.

## User Story / User story

- Là Customer, tôi muốn biết thương hiệu để tin tưởng sản phẩm.
- Là Manager, tôi muốn quản lý brand để sản phẩm nhất quán.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| View brand info | Guest, Customer | Khách hiểu thương hiệu. |
| Manage brand | Manager, Admin | Brand được cập nhật đúng. |
| Assign brand to product | Manager, Admin | Sản phẩm có thương hiệu phù hợp. |

## Business Flow / Luồng nghiệp vụ

1. Manager tạo hoặc cập nhật brand.
2. Hệ thống kiểm tra tên và trạng thái.
3. Manager gắn brand với sản phẩm.
4. Khách xem sản phẩm kèm thông tin brand.

## Validation Rule / Quy tắc validation

- Brand phải có tên.
- Brand không được trùng gây nhầm.
- Brand có chứng nhận phải dùng media hợp lệ.

## Permission / Phân quyền

Guest/Customer xem brand public. Manager/Admin quản lý. Staff chỉ xem.

## Acceptance Criteria / Tiêu chí hoàn thành

- Brand được quản lý rõ.
- Sản phẩm có thể gắn brand phù hợp.
- Brand không gây hiểu nhầm.
- Media chứng nhận có quyền xem phù hợp.

## Edge Cases / Trường hợp biên

- Brand đổi tên.
- Brand không còn sản phẩm.
- Một sản phẩm từ nhiều nguồn phân phối.

## Error Cases / Trường hợp lỗi

- Tên brand rỗng.
- Brand trùng.
- Brand bị ẩn nhưng sản phẩm vẫn public.

## Future Enhancement / Mở rộng tương lai

- Brand landing page.
- Supplier integration.
- Brand trust score.

