# Products Feature Specification / Đặc tả tính năng sản phẩm

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Categories, Brands, Media, Inventory |
| Version | MVP |
| Owner | Product Owner, Manager |
| Status | Runtime ready for public catalog and Prompt 35 Admin Product management |

## Overview / Tổng quan

Products quản lý thông tin sản phẩm healthy được bán trên HealthyHub, gồm nội dung, trạng thái bán, thông tin thành phần, hình ảnh và phân loại.

## Business Goal / Mục tiêu kinh doanh

Giúp khách hiểu sản phẩm rõ ràng, tăng niềm tin khi mua và giúp cửa hàng quản lý danh mục bán hàng có hệ thống.

## Runtime Scope / Phạm vi runtime

Trong phạm vi runtime hiện tại: danh sách public, chi tiết public, Review summary/detail integration, Admin list/detail/create/update/lifecycle/soft-delete, Category/Brand assignment, content, nutrition, ingredients, dietary tags và existing Media links.

Ngoài phạm vi Prompt 35: Inventory quantity adjustment, upload infrastructure, import/export jobs, full Category/Brand CRUD, Review moderation, Supplier, Promotion và AI.

## Requirement / Yêu cầu

- Sản phẩm công khai phải có tên, mô tả, hình ảnh và trạng thái bán.
- Sản phẩm healthy nên có thông tin thành phần, lưu ý sử dụng và cảnh báo dị ứng nếu có.
- Manager/Admin có `products:manage` có thể tạo, cập nhật, ẩn/xuất bản và soft-delete sản phẩm.
- Sản phẩm hết hàng phải hiển thị đúng khả năng mua.
- Nội dung sản phẩm không được đưa tuyên bố y tế sai lệch.

## User Story / User story

- Là Guest, tôi muốn xem sản phẩm để quyết định mua.
- Là Customer, tôi muốn hiểu thành phần và lưu ý trước khi đặt hàng.
- Là Manager, tôi muốn cập nhật sản phẩm nhanh và chính xác.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| View product list | Guest, Customer | Danh sách sản phẩm được hiển thị. |
| View product detail | Guest, Customer | Khách hiểu thông tin sản phẩm. |
| Manage product | Manager, Admin | Sản phẩm được tạo/cập nhật theo canonical Product rule. |
| Publish product | Manager, Admin | Sản phẩm đủ invariant được public; Inventory vẫn quyết định availability. |

## Business Flow / Luồng nghiệp vụ

1. Manager/Admin nhập hoặc cập nhật thông tin sản phẩm trong Admin Product form.
2. Hệ thống kiểm tra điều kiện nội dung tối thiểu.
3. Sản phẩm được gắn category, brand và media phù hợp.
4. Trạng thái bán được xác nhận.
5. Khách xem sản phẩm công khai và quyết định mua.

## Validation Rule / Quy tắc validation

- Sản phẩm công khai không được thiếu tên hoặc trạng thái bán.
- Sản phẩm bán công khai phải có ít nhất một category chính.
- Hình ảnh phải đúng sản phẩm.
- Cảnh báo dị ứng/lưu ý phải hiển thị nếu sản phẩm có thông tin này.

## Permission / Phân quyền

Guest/Customer xem sản phẩm công khai. Internal actor có `products:read` xem Admin list/detail/options. Internal actor có `products:manage` tạo, cập nhật lifecycle và soft-delete. Frontend permission chỉ là UX; backend guard là authority.

## Acceptance Criteria / Tiêu chí hoàn thành

- Sản phẩm có nội dung đủ để khách hiểu.
- Sản phẩm có trạng thái bán rõ.
- Category, brand và media liên quan được gắn đúng.
- Sản phẩm hết hàng không gây hiểu nhầm.
- Nội dung không chứa claim y tế không kiểm chứng.

## Edge Cases / Trường hợp biên

- Sản phẩm tạm hết hàng.
- Sản phẩm có nhiều biến thể tương lai.
- Sản phẩm có cảnh báo dị ứng.
- Sản phẩm cần ẩn khỏi public nhưng vẫn giữ lịch sử đơn.

## Error Cases / Trường hợp lỗi

- Sản phẩm thiếu thông tin bắt buộc.
- Category hoặc brand không hợp lệ.
- Media bị thiếu hoặc không được phép dùng.
- Người quản lý không đủ quyền cập nhật.

## Future Enhancement / Mở rộng tương lai

- Product variants.
- Product bundle.
- AI product summary.
- QR product scanner.
