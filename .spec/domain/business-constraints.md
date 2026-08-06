# Business Constraints / Ràng buộc nghiệp vụ

## Global Constraints / Ràng buộc toàn hệ thống

- Không bán sản phẩm không đủ điều kiện hiển thị hoặc không còn khả năng bán.
- Không xử lý đơn hàng khi thiếu thông tin khách, sản phẩm, nhận hàng hoặc trạng thái.
- Không cấp quyền vượt vai trò.
- Không dùng dữ liệu khách hàng cho AI/marketing nếu chưa có policy phù hợp.
- Không để AI thay thế quyết định của staff/manager/admin ở luồng rủi ro.
- Không đưa claim y tế hoặc chẩn đoán trong nội dung sản phẩm, blog hoặc AI output.

## Domain Constraint Summary / Tổng hợp ràng buộc theo domain

| Domain / Domain | Constraint / Ràng buộc chính |
| --- | --- |
| Authentication | Tài khoản bị khóa hoặc chưa hợp lệ không được đăng nhập. |
| User | Quyền phải đúng vai trò, thay đổi quan trọng cần audit. |
| Customer | Khách chỉ xem dữ liệu của chính mình, staff xem giới hạn. |
| Staff | Staff chỉ thao tác trong phạm vi vận hành được cấp. |
| Product | Sản phẩm public phải có thông tin tối thiểu và trạng thái bán rõ. |
| Category | Danh mục không trùng nghĩa và giúp khách tìm sản phẩm. |
| Brand | Thương hiệu không gây hiểu nhầm nguồn gốc. |
| Inventory | Tồn kho phản ánh khả năng bán và không được gây oversell. |
| Cart | Cart phải kiểm tra lại giá, tồn kho và coupon trước khi đặt hàng. |
| Wishlist | Wishlist là dữ liệu cá nhân của khách và không public mặc định. |
| Order | Trạng thái đơn chỉ chuyển theo flow hợp lệ. |
| Payment | Payment status phải rõ; refund/adjustment cần quyền cao. |
| Shipping | Địa chỉ nhận hàng phải đủ để giao. |
| Coupon | Coupon chỉ áp dụng khi còn hiệu lực và đủ điều kiện. |
| Promotion | Promotion phải có thời gian, điều kiện và rule ưu tiên rõ. |
| Loyalty | Điểm chỉ phát sinh từ hành vi hợp lệ và phải điều chỉnh khi hủy/hoàn. |
| Review | Review vi phạm policy phải được ẩn hoặc kiểm duyệt. |
| Blog | Nội dung healthy không thay thế tư vấn y tế. |
| Media | Media public phải đúng mục đích và không gây hiểu nhầm. |
| Notification | Marketing notification phải tôn trọng opt-in. |
| Analytics | Analytics chỉ đọc/tổng hợp, không sửa dữ liệu vận hành. |
| AI | AI phải có context, safety, fallback và không dùng dữ liệu nhạy cảm trái policy. |
| Settings | Cấu hình ảnh hưởng bảo mật/thanh toán/giao hàng cần quyền cao và audit. |

