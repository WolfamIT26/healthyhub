# Business Domains / Domain nghiệp vụ

## Overview / Tổng quan

Business Domain là các vùng nghiệp vụ chính của HealthyHub. Mỗi domain có thể trở thành module hoặc một phần của module trong giai đoạn thiết kế hệ thống.

## Domain Specification / Đặc tả domain

| Domain / Domain | Business Meaning / Ý nghĩa nghiệp vụ | Main Responsibility / Trách nhiệm chính |
| --- | --- | --- |
| Product | Sản phẩm healthy được bán. | Quản lý thông tin sản phẩm, trạng thái bán, nội dung, hình ảnh và thuộc tính thương mại. |
| Category | Nhóm phân loại sản phẩm. | Giúp khách tìm sản phẩm theo nhóm như sữa hạt, sữa chua, đồ ăn dinh dưỡng. |
| Brand | Thương hiệu hoặc nhà sản xuất. | Quản lý nguồn gốc thương hiệu và hỗ trợ lọc/tìm kiếm sản phẩm. |
| Inventory | Tồn kho. | Theo dõi khả năng bán và cảnh báo thiếu hàng ở mức nghiệp vụ. |
| Order | Đơn hàng. | Ghi nhận quá trình khách đặt mua và cửa hàng xử lý đơn. |
| Cart | Giỏ hàng. | Lưu danh sách sản phẩm khách muốn mua trước khi đặt hàng. |
| Coupon | Mã giảm giá. | Áp dụng ưu đãi theo điều kiện rõ ràng. |
| Promotion | Chương trình khuyến mãi. | Quản lý chiến dịch giảm giá hoặc ưu đãi theo thời gian. |
| Payment | Thanh toán. | Theo dõi phương thức, trạng thái và xác nhận thanh toán ở mức nghiệp vụ. |
| Shipping | Giao hàng. | Quản lý địa chỉ, phí vận chuyển, trạng thái giao và thông tin người nhận. |
| Customer | Khách hàng. | Quản lý hồ sơ, lịch sử mua, phân nhóm và chăm sóc khách. |
| Loyalty | Thành viên và điểm thưởng. | Tăng giữ chân khách bằng điểm, cấp bậc và ưu đãi. |
| AI | Năng lực AI toàn hệ thống. | Hỗ trợ tìm kiếm, tư vấn, gợi ý, marketing, analytics và vận hành. |
| Notification | Thông báo. | Gửi thông tin về tài khoản, đơn hàng, ưu đãi và chăm sóc khách. |
| Review | Đánh giá sản phẩm. | Thu thập phản hồi khách hàng, hỗ trợ uy tín sản phẩm. |
| Blog | Nội dung bài viết. | Giáo dục khách hàng về healthy lifestyle và sản phẩm. |
| Media | Tài nguyên hình ảnh/tài liệu. | Quản lý ảnh sản phẩm, banner, chứng nhận và file upload. |
| Analytics | Phân tích kinh doanh. | Theo dõi doanh số, hành vi khách, tồn kho, marketing và hiệu quả AI. |
| Settings | Cấu hình hệ thống. | Quản lý cấu hình cửa hàng, quyền, thông báo, SEO và vận hành. |

## Domain Boundary / Ranh giới domain

- Product không chịu trách nhiệm trực tiếp xử lý đơn hàng.
- Inventory chỉ quyết định khả năng bán, không thay thế kế toán kho chi tiết.
- Payment chỉ theo dõi trạng thái thanh toán ở mức nghiệp vụ, tích hợp thật sẽ qua Payment Gateway.
- AI không được thay thế quyết định quản trị hoặc tư vấn y tế chuyên môn.
- Analytics chỉ tổng hợp và diễn giải dữ liệu, không sửa dữ liệu vận hành.

