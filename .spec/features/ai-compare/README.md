# AI Compare Feature Specification / Đặc tả tính năng AI Compare

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Products, AI Gateway |
| Version | Version 1.5 |
| Owner | Product Owner, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Compare hỗ trợ so sánh nhiều sản phẩm theo thông tin đã có như thành phần, điểm khác biệt, giá trị sử dụng và lưu ý.

## Business Goal / Mục tiêu kinh doanh

Giúp khách ra quyết định mua dễ hơn khi có nhiều sản phẩm healthy tương tự.

## Scope / Phạm vi

Trong phạm vi: so sánh thông tin sản phẩm public, điểm giống/khác, lưu ý sử dụng, cảnh báo dị ứng nếu có. Ngoài phạm vi: khẳng định sản phẩm tốt cho bệnh lý, thuật toán scoring y tế, UI compare.

## Requirement / Yêu cầu

- Chỉ so sánh sản phẩm tồn tại và public.
- So sánh phải dựa trên dữ liệu sản phẩm.
- Không tạo claim y tế.
- Cần nêu khi dữ liệu sản phẩm thiếu.

## User Story / User story

- Là Customer, tôi muốn so sánh hai loại sữa hạt.
- Là Guest, tôi muốn biết khác nhau giữa sản phẩm ít đường và thường.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Compare products | Guest, Customer | Nhận bảng/đoạn so sánh nghiệp vụ. |
| Explain ingredients difference | Customer | Hiểu khác biệt thành phần. |
| Missing data fallback | Customer | Biết dữ liệu nào chưa đủ. |

## Business Flow / Luồng nghiệp vụ

1. Người dùng chọn sản phẩm để so sánh.
2. AI lấy thông tin public của các sản phẩm.
3. AI tạo nội dung so sánh theo tiêu chí an toàn.
4. Hệ thống kiểm tra output không vượt phạm vi.
5. Người dùng quyết định sản phẩm phù hợp.

## Validation Rule / Quy tắc validation

- Ít nhất hai sản phẩm hợp lệ để so sánh.
- Không so sánh sản phẩm không public.
- Nếu thiếu dữ liệu, phải nói rõ.
- Không khuyến nghị y tế cá nhân hóa.

## Permission / Phân quyền

Guest/Customer dùng compare public. Manager/Admin đảm bảo dữ liệu sản phẩm chính xác. AI chỉ đọc dữ liệu được phép.

## Acceptance Criteria / Tiêu chí hoàn thành

- So sánh rõ điểm giống/khác.
- Output dựa trên dữ liệu sản phẩm.
- Có fallback khi thiếu dữ liệu.
- Không đưa claim y tế.

## Edge Cases / Trường hợp biên

- Sản phẩm thiếu thành phần.
- Một sản phẩm hết hàng.
- Người dùng so sánh quá nhiều sản phẩm.

## Error Cases / Trường hợp lỗi

- Sản phẩm không tồn tại.
- Dữ liệu không đủ.
- AI output vượt phạm vi an toàn.

## Future Enhancement / Mở rộng tương lai

- Saved comparison.
- AI healthy score với disclaimer.
- Side-by-side UI ở prompt UI sau.

