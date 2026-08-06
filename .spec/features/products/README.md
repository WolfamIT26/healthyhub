# Products Feature Specification / Đặc tả tính năng sản phẩm

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Categories, Brands, Media, Inventory |
| Version | MVP |
| Owner | Product Owner, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Products quản lý thông tin sản phẩm healthy được bán trên HealthyHub, gồm nội dung, trạng thái bán, thông tin thành phần, hình ảnh và phân loại.

## Business Goal / Mục tiêu kinh doanh

Giúp khách hiểu sản phẩm rõ ràng, tăng niềm tin khi mua và giúp cửa hàng quản lý danh mục bán hàng có hệ thống.

## Scope / Phạm vi

Trong phạm vi: danh sách sản phẩm, chi tiết sản phẩm, trạng thái bán, nội dung healthy, hình ảnh, category/brand liên quan. Ngoài phạm vi: database product schema, API catalog, UI trang sản phẩm.

## Requirement / Yêu cầu

- Sản phẩm công khai phải có tên, mô tả, hình ảnh và trạng thái bán.
- Sản phẩm healthy nên có thông tin thành phần, lưu ý sử dụng và cảnh báo dị ứng nếu có.
- Manager/Admin có thể tạo, cập nhật, ẩn hoặc xuất bản sản phẩm.
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
| Manage product | Manager, Admin | Sản phẩm được tạo/cập nhật theo rule. |
| Publish product | Manager, Admin | Sản phẩm sẵn sàng bán công khai. |

## Business Flow / Luồng nghiệp vụ

1. Manager/Admin nhập hoặc cập nhật thông tin sản phẩm.
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

Guest/Customer xem sản phẩm công khai. Staff có thể xem phục vụ vận hành. Manager/Admin quản lý sản phẩm. Super Admin không quản lý sản phẩm cửa hàng trừ khi SaaS yêu cầu.

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

