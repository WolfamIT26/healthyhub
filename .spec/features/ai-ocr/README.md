# AI OCR Feature Specification / Đặc tả tính năng AI OCR

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Future |
| Dependency | Media, Products, AI Gateway, OCR Gateway |
| Version | Future |
| Owner | AI Engineer, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

AI OCR đọc chữ từ nhãn sản phẩm, chứng nhận hoặc tài liệu upload để hỗ trợ nhập liệu và kiểm tra thông tin.

## Business Goal / Mục tiêu kinh doanh

Giảm thao tác nhập tay và hỗ trợ chuẩn hóa thông tin sản phẩm healthy.

## Scope / Phạm vi

Trong phạm vi: trích xuất chữ từ media được phép, gợi ý thông tin cần review, đánh dấu độ tin cậy. Ngoài phạm vi: tự động lưu dữ liệu không kiểm duyệt, OCR provider implementation, database.

## Requirement / Yêu cầu

- OCR chỉ xử lý media được phép.
- Kết quả OCR cần người có quyền xác nhận trước khi dùng chính thức.
- OCR phải ghi rõ khi kết quả không chắc chắn.
- Không xử lý tài liệu nhạy cảm nếu chưa có policy.

## User Story / User story

- Là Manager, tôi muốn OCR nhãn sản phẩm để nhập thành phần nhanh hơn.
- Là Staff, tôi muốn kiểm tra nội dung chứng nhận bằng hỗ trợ OCR.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Extract label text | Manager | Có text nhãn để review. |
| Extract certificate text | Admin | Có text tài liệu để kiểm tra. |
| Confirm OCR result | Manager | Kết quả được dùng sau khi duyệt. |

## Business Flow / Luồng nghiệp vụ

1. Người có quyền chọn media.
2. OCR trích xuất chữ.
3. Hệ thống hiển thị kết quả và độ tin cậy.
4. Manager/Admin xác nhận hoặc chỉnh sửa.
5. Kết quả được dùng làm nguồn dữ liệu nếu được duyệt.

## Validation Rule / Quy tắc validation

- Media phải thuộc phạm vi được phép OCR.
- Kết quả chưa duyệt không được dùng làm dữ liệu chính thức.
- Dữ liệu nhạy cảm cần policy trước khi xử lý.

## Permission / Phân quyền

Manager/Admin chạy OCR cho product/media. Staff dùng giới hạn nếu được cấp. Customer không chạy OCR quản trị.

## Acceptance Criteria / Tiêu chí hoàn thành

- OCR có output để review.
- Kết quả cần xác nhận người thật.
- Media nhạy cảm được kiểm soát.
- Không tự động ghi đè dữ liệu sản phẩm.

## Edge Cases / Trường hợp biên

- Ảnh mờ.
- Nhãn nhiều ngôn ngữ.
- OCR đọc sai đơn vị.
- Chứng nhận hết hạn.

## Error Cases / Trường hợp lỗi

- Media không hợp lệ.
- OCR không đọc được.
- Người dùng không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Ingredient extraction.
- OCR quality scoring.
- Auto-suggest product fields after approval.

