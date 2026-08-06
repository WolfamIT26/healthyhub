# Acceptance Criteria / Tiêu chí hoàn thành

## Overview / Tổng quan

Mỗi module chỉ được xem là hoàn thành ở mức nghiệp vụ khi đáp ứng tiêu chí bên dưới. Đây chưa phải test case kỹ thuật.

## Module Criteria / Tiêu chí theo module

| Module / Module | Acceptance Criteria / Tiêu chí hoàn thành |
| --- | --- |
| Authentication | Người dùng có luồng đăng ký, đăng nhập, đăng xuất và xử lý tài khoản bị khóa theo rule nghiệp vụ. |
| Users & Permissions | Vai trò được phân biệt rõ, quyền truy cập quan trọng có rule và có thể audit. |
| Products | Sản phẩm có nội dung đủ để khách hiểu, có trạng thái bán và được gắn category/media phù hợp. |
| Categories | Danh mục giúp khách tìm sản phẩm dễ, không trùng nghĩa và có thể quản lý được. |
| Brands | Thương hiệu được quản lý rõ và không gây hiểu nhầm nguồn gốc sản phẩm. |
| Media | Ảnh/tài liệu được dùng đúng mục đích, có quyền xem phù hợp với tài liệu nhạy cảm. |
| Inventory | Tồn kho phản ánh khả năng bán, có cảnh báo gần hết và có rule xử lý hết hàng. |
| Cart | Giỏ hàng kiểm tra lại sản phẩm, tồn kho, giá và ưu đãi trước khi đặt hàng. |
| Orders | Đơn hàng có vòng đời rõ từ tạo, xử lý, giao, hoàn tất hoặc hủy. |
| Payment | Trạng thái thanh toán rõ ràng và không cho phép xử lý sai chính sách thanh toán. |
| Shipping | Thông tin giao hàng đủ rõ và trạng thái giao được cập nhật theo vận hành. |
| Customers | Hồ sơ khách hàng, lịch sử mua và chăm sóc khách được quản lý đúng quyền. |
| Promotion | Coupon/promotion áp dụng theo điều kiện, thời gian và rule ưu tiên rõ. |
| Loyalty | Điểm/cấp bậc phát sinh từ hành vi hợp lệ và có rule điều chỉnh khi hủy/hoàn. |
| Reviews | Review phản ánh trải nghiệm khách hàng và có kiểm duyệt nội dung không phù hợp. |
| Blog & Content | Nội dung hỗ trợ giáo dục khách hàng, phù hợp SEO và không đưa lời khuyên y tế sai lệch. |
| Notifications | Thông báo đúng ngữ cảnh, ưu tiên luồng quan trọng và tôn trọng opt-in marketing. |
| AI Platform | AI có prompt/context/safety/fallback/logging rõ và không vượt phạm vi dữ liệu được phép. |
| Analytics | Báo cáo giúp manager hiểu tình hình kinh doanh, tồn kho, khách hàng và hiệu quả marketing. |
| Settings | Cấu hình cửa hàng rõ quyền, thay đổi quan trọng có kiểm soát và sẵn sàng mở rộng SaaS. |

## Completion Rule / Quy tắc hoàn thành

Một module chưa được xem là sẵn sàng triển khai nếu thiếu business rule, acceptance criteria, permission impact hoặc dependency rõ ràng.

