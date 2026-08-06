# Target Users / Người dùng mục tiêu

## Overview / Tổng quan

HealthyHub phục vụ cả khách mua hàng và đội vận hành cửa hàng. Hệ thống phải phân biệt rõ quyền xem, quyền mua, quyền quản lý và quyền cấu hình.

## User Groups / Nhóm người dùng

| User / Người dùng | Description / Mô tả | Primary Needs / Nhu cầu chính |
| --- | --- | --- |
| Guest | Người chưa đăng nhập. | Xem sản phẩm, tìm kiếm, đọc blog, thêm giỏ hàng tạm, đăng ký tài khoản. |
| Customer | Người đã mua hoặc có tài khoản cơ bản. | Quản lý thông tin cá nhân, đặt hàng, theo dõi đơn, nhận hỗ trợ. |
| Member | Khách hàng có tài khoản đã xác minh và hoạt động thường xuyên. | Lưu địa chỉ, xem lịch sử đơn, nhận ưu đãi thành viên. |
| VIP Customer | Khách hàng giá trị cao hoặc thuộc nhóm chăm sóc đặc biệt. | Ưu đãi riêng, hỗ trợ ưu tiên, gợi ý cá nhân hóa. |
| Staff | Nhân sự vận hành cửa hàng. | Xử lý đơn, cập nhật trạng thái, hỗ trợ khách, kiểm tra tồn kho. |
| Manager | Quản lý cửa hàng. | Quản lý sản phẩm, tồn kho, khuyến mãi, nhân sự và báo cáo. |
| Administrator | Quản trị hệ thống của cửa hàng. | Cấu hình hệ thống, phân quyền, quản lý dữ liệu chính. |
| Super Admin | Vai trò nền tảng tương lai khi mở rộng SaaS. | Quản lý nhiều cửa hàng, cấu hình tenant, giám sát hệ thống. |

## User Priority / Ưu tiên người dùng

- MVP ưu tiên Guest, Customer, Staff, Manager và Administrator.
- VIP Customer có thể xuất hiện từ Version 1.0 khi loyalty đủ dữ liệu.
- Super Admin là chuẩn bị cho SaaS, chưa phải trọng tâm MVP.

## User Experience Principles / Nguyên tắc trải nghiệm

- Khách mua hàng phải hiểu sản phẩm nhanh, không cần kiến thức dinh dưỡng chuyên sâu.
- Staff cần thao tác ít bước, trạng thái đơn rõ ràng và tránh nhầm lẫn.
- Manager cần nhìn được tình hình kinh doanh và tồn kho mà không cần thao tác kỹ thuật.
- Admin và Super Admin cần quyền mạnh nhưng phải có audit log.

