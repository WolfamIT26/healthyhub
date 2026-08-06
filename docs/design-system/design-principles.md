# Design Principles / Nguyên tắc thiết kế

## Purpose / Mục tiêu

Tài liệu này định nghĩa các nguyên tắc thiết kế cốt lõi cho HealthyHub. Đây là chuẩn để đánh giá mọi màn hình, component và quyết định giao diện ở các prompt sau.

## Core Principles / Nguyên tắc cốt lõi

| Principle / Nguyên tắc | Meaning / Ý nghĩa | Application / Cách áp dụng |
| --- | --- | --- |
| Trust First / Ưu tiên niềm tin | Sản phẩm healthy cần thông tin rõ, đáng tin và không thổi phồng. | Hiển thị thành phần, giá, tồn kho, cảnh báo dị ứng và nguồn AI rõ ràng. |
| Shop Fast / Mua nhanh | Người dùng phải tìm, hiểu và mua sản phẩm ít bước. | Ưu tiên search, filter, product card rõ, cart/checkout dễ quét. |
| Vietnamese First / Tiếng Việt trước | Giao diện phục vụ khách hàng Việt Nam. | UI label, lỗi form, empty state và toast dùng tiếng Việt tự nhiên. |
| Calm Operations / Vận hành gọn | Admin/staff cần màn hình làm việc cô đọng, dễ quét, không trang trí quá mức. | Bảng, filter, status badge, action bar và drawer phải ưu tiên hiệu suất thao tác. |
| AI Transparent / AI minh bạch | AI hỗ trợ nhưng không thay con người trong quyết định rủi ro. | AI output cần nguồn, mức tin cậy, disclaimer và trạng thái cần duyệt khi phù hợp. |
| Accessible by Default / Tiếp cận mặc định | Giao diện phải dễ đọc và dùng được với nhiều nhóm người. | Tương phản đủ, form có label, trạng thái không chỉ dùng màu. |
| Mobile Ready / Sẵn sàng mobile | Web làm trước nhưng layout không khóa vào desktop. | Token spacing, grid, component state và navigation phải có quy tắc mobile. |

## Tone / Sắc thái trải nghiệm

HealthyHub nên có cảm giác sạch, rõ, gần gũi và đáng tin. Không dùng phong cách quá marketing, quá trang trí hoặc chỉ dựa vào một màu xanh duy nhất. Storefront có thể ấm và thân thiện; admin phải yên tĩnh, có trật tự và ưu tiên dữ liệu.

## Product-Specific Rules / Quy tắc riêng cho HealthyHub

- Thông tin sản phẩm phải dễ đọc hơn yếu tố trang trí.
- Nội dung dinh dưỡng là tham khảo, không trình bày như tư vấn y tế.
- Trạng thái giá, hết hàng, khuyến mãi và cảnh báo dị ứng phải nổi bật vừa đủ.
- Admin action nguy hiểm phải có xác nhận rõ.
- AI recommendation phải cho người dùng hiểu lý do gợi ý ở mức ngắn gọn.

## Decision Rule / Quy tắc ra quyết định

Khi có mâu thuẫn giữa thẩm mỹ và khả năng dùng, ưu tiên khả năng dùng. Khi có mâu thuẫn giữa tốc độ thao tác và an toàn, ưu tiên an toàn với thao tác nhạy cảm như thanh toán, hủy đơn, đổi quyền, refund, publish nội dung AI.

