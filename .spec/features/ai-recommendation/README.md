# AI Recommendation Feature Specification / Đặc tả tính năng AI Recommendation

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Products, Customers, Orders, Wishlist, AI Gateway |
| Version | Version 1.5 |
| Owner | Product Owner, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Recommendation gợi ý sản phẩm phù hợp dựa trên sản phẩm public, hành vi hợp lệ và nhu cầu khách hàng trong phạm vi an toàn.

## Business Goal / Mục tiêu kinh doanh

Tăng chuyển đổi và giá trị đơn hàng bằng gợi ý có liên quan, không gây hiểu nhầm về công dụng sức khỏe.

## Scope / Phạm vi

Trong phạm vi: gợi ý sản phẩm liên quan, sản phẩm bổ sung, sản phẩm theo nhu cầu chung. Ngoài phạm vi: chẩn đoán sức khỏe, gợi ý dựa trên dữ liệu nhạy cảm chưa có consent, thuật toán triển khai.

## Requirement / Yêu cầu

- Chỉ gợi ý sản phẩm đang được phép bán.
- Không gợi ý trái cảnh báo dị ứng nếu có dữ liệu.
- Gợi ý phải giải thích được lý do ở mức nghiệp vụ.
- Người dùng có thể bỏ qua gợi ý.

## User Story / User story

- Là Customer, tôi muốn nhận gợi ý sản phẩm phù hợp nhu cầu.
- Là VIP Customer, tôi muốn gợi ý cá nhân hóa hơn khi có consent.
- Là Manager, tôi muốn gợi ý không làm sai chính sách bán hàng.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Recommend related products | Customer | Nhận sản phẩm liên quan. |
| Recommend complementary products | Customer | Nhận sản phẩm bổ sung. |
| Explain recommendation | Customer | Hiểu lý do gợi ý. |

## Business Flow / Luồng nghiệp vụ

1. Customer xem sản phẩm hoặc cung cấp nhu cầu.
2. AI lấy context sản phẩm và rule an toàn.
3. AI tạo danh sách gợi ý.
4. Hệ thống kiểm tra sản phẩm được phép bán.
5. Customer chọn hoặc bỏ qua gợi ý.

## Validation Rule / Quy tắc validation

- Sản phẩm gợi ý phải public và còn bán được.
- Không dùng dữ liệu nhạy cảm nếu chưa có consent/policy.
- Không đưa lời khẳng định y tế.
- Gợi ý cần fallback khi dữ liệu ít.

## Permission / Phân quyền

Guest có thể nhận gợi ý chung. Customer/Member/VIP nhận gợi ý theo dữ liệu được phép. Manager/Admin cấu hình policy. AI không sửa dữ liệu.

## Acceptance Criteria / Tiêu chí hoàn thành

- Có gợi ý theo sản phẩm/nhu cầu.
- Gợi ý tuân thủ availability và safety.
- Có lý do gợi ý ngắn gọn.
- Có fallback khi thiếu dữ liệu.

## Edge Cases / Trường hợp biên

- Sản phẩm liên quan hết hàng.
- Khách có cảnh báo dị ứng.
- Lịch sử mua quá ít.
- Gợi ý lặp lại sản phẩm đang xem.

## Error Cases / Trường hợp lỗi

- Không có sản phẩm phù hợp.
- AI output chứa sản phẩm không tồn tại.
- AI Gateway lỗi ở phase sau.

## Future Enhancement / Mở rộng tương lai

- Personalized ranking.
- Bundle recommendation.
- AI recommendation A/B testing.

