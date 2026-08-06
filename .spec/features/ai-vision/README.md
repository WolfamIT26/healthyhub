# AI Vision Feature Specification / Đặc tả tính năng AI Vision

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Future |
| Dependency | Media, Products, AI Gateway, Vision Gateway |
| Version | Future |
| Owner | AI Engineer, Product Owner |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Vision nhận diện hình ảnh sản phẩm, QR hoặc món ăn để hỗ trợ tìm kiếm và quản lý dữ liệu hình ảnh.

## Business Goal / Mục tiêu kinh doanh

Tạo trải nghiệm tìm sản phẩm bằng hình ảnh và hỗ trợ vận hành media/product trong tương lai.

## Scope / Phạm vi

Trong phạm vi: nhận diện ảnh sản phẩm/QR/món ăn ở mức gợi ý, tìm sản phẩm liên quan, yêu cầu xác nhận người dùng. Ngoài phạm vi: tự động chẩn đoán dinh dưỡng từ ảnh, vision provider implementation, mobile scanner.

## Requirement / Yêu cầu

- Vision output chỉ là gợi ý, cần xác nhận.
- Không tự động thay đổi dữ liệu sản phẩm.
- Ảnh chứa dữ liệu nhạy cảm không xử lý nếu chưa có policy.
- Kết quả phải fallback khi độ tin cậy thấp.

## User Story / User story

- Là Customer, tôi muốn quét hình để tìm sản phẩm liên quan.
- Là Manager, tôi muốn kiểm tra ảnh sản phẩm đúng loại.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Scan product image | Customer | Gợi ý sản phẩm liên quan. |
| Scan QR | Customer | Gợi ý trang sản phẩm nếu hợp lệ. |
| Validate product media | Manager | Media được gợi ý kiểm tra. |

## Business Flow / Luồng nghiệp vụ

1. Người dùng chọn hoặc chụp ảnh ở phase sau.
2. Vision phân tích hình ảnh.
3. Hệ thống trả gợi ý và độ tin cậy.
4. Người dùng xác nhận kết quả.
5. Nếu không đủ tin cậy, hệ thống fallback sang tìm kiếm thủ công.

## Validation Rule / Quy tắc validation

- Không xử lý ảnh ngoài phạm vi policy.
- Kết quả độ tin cậy thấp không được hiển thị như chắc chắn.
- Không nhận diện bệnh lý hoặc tư vấn y tế từ ảnh.

## Permission / Phân quyền

Customer dùng vision public khi feature bật. Manager/Admin dùng vision cho media/product review. AI không tự sửa dữ liệu.

## Acceptance Criteria / Tiêu chí hoàn thành

- Vision trả gợi ý có kiểm soát.
- Có fallback khi không nhận diện được.
- Không tự động ghi dữ liệu.
- Dữ liệu ảnh nhạy cảm được kiểm soát.

## Edge Cases / Trường hợp biên

- Ảnh mờ.
- Ảnh nhiều sản phẩm.
- QR không thuộc HealthyHub.
- Ảnh món ăn không có sản phẩm tương ứng.

## Error Cases / Trường hợp lỗi

- Vision Gateway lỗi ở phase sau.
- Ảnh không hợp lệ.
- Không đủ quyền xử lý media.

## Future Enhancement / Mở rộng tương lai

- Mobile scanner.
- Food image recognition.
- Visual product search.

