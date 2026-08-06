# Media Feature Specification / Đặc tả tính năng media

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Products, Brands, Blog, Storage Gateway |
| Version | MVP |
| Owner | Manager, Marketing |
| Status | Draft for business specification |

## Overview / Tổng quan

Media quản lý hình ảnh sản phẩm, banner, chứng nhận và tài liệu upload ở mức nghiệp vụ.

## Business Goal / Mục tiêu kinh doanh

Đảm bảo hình ảnh và tài liệu dùng trong bán hàng rõ ràng, đúng sản phẩm và không gây hiểu nhầm.

## Scope / Phạm vi

Trong phạm vi: phân loại media, quyền xem, trạng thái sử dụng, liên kết với product/brand/blog. Ngoài phạm vi: storage implementation, upload API, image processing.

## Requirement / Yêu cầu

- Ảnh sản phẩm phải đúng sản phẩm.
- Media chứng nhận hoặc tài liệu nhạy cảm cần quyền xem.
- Media không dùng nữa có thể ẩn hoặc lưu trữ.
- Marketing có thể dùng media cho banner/content theo policy.

## User Story / User story

- Là Customer, tôi muốn xem ảnh sản phẩm rõ ràng.
- Là Manager, tôi muốn quản lý ảnh sản phẩm đúng.
- Là Marketing, tôi muốn dùng banner cho chiến dịch.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Attach product image | Manager | Sản phẩm có hình ảnh phù hợp. |
| Manage certificate media | Manager, Admin | Tài liệu có quyền xem phù hợp. |
| Use banner | Marketing | Banner phục vụ nội dung/chiến dịch. |

## Business Flow / Luồng nghiệp vụ

1. Người có quyền chọn hoặc tải media ở phase sau.
2. Media được phân loại theo mục đích.
3. Media gắn với product, brand, blog hoặc campaign.
4. Media public hiển thị cho khách.
5. Media nhạy cảm kiểm soát quyền xem.

## Validation Rule / Quy tắc validation

- Media public phải phù hợp nội dung liên kết.
- Chứng nhận không public nếu chưa được phép.
- Không dùng ảnh sai sản phẩm.
- Media không được chứa secret hoặc dữ liệu nhạy cảm ngoài policy.

## Permission / Phân quyền

Guest/Customer xem media public. Staff xem theo vận hành. Manager/Admin quản lý media. Marketing dùng media cho content/campaign theo quyền.

## Acceptance Criteria / Tiêu chí hoàn thành

- Media được phân loại rõ.
- Product/brand/blog có media phù hợp.
- Media nhạy cảm có quyền xem.
- Media không dùng nữa có trạng thái xử lý.

## Edge Cases / Trường hợp biên

- Ảnh sản phẩm cũ khi bao bì thay đổi.
- Chứng nhận hết hạn.
- Media dùng chung nhiều sản phẩm.

## Error Cases / Trường hợp lỗi

- Media sai định dạng ở phase sau.
- Media không đủ quyền xem.
- Media liên kết với nội dung đã ẩn.

## Future Enhancement / Mở rộng tương lai

- Image optimization.
- AI OCR media extraction.
- Digital asset approval flow.

