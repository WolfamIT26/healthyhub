# Business Flows / Luồng nghiệp vụ

## Register Flow / Luồng đăng ký

1. Người dùng nhập thông tin đăng ký.
2. Hệ thống kiểm tra thông tin bắt buộc và điều kiện hợp lệ.
3. Người dùng xác minh thông tin nếu chính sách yêu cầu.
4. Tài khoản được tạo với quyền khách hàng.
5. Hệ thống gửi thông báo chào mừng hoặc xác minh.

## Login Flow / Luồng đăng nhập

1. Người dùng nhập thông tin đăng nhập.
2. Hệ thống xác thực danh tính.
3. Hệ thống kiểm tra trạng thái tài khoản.
4. Người dùng được chuyển vào trải nghiệm phù hợp với vai trò.
5. Đăng nhập thất bại nhiều lần cần được giới hạn và ghi nhận.

## Search Flow / Luồng tìm kiếm

1. Người dùng nhập từ khóa hoặc chọn bộ lọc.
2. Hệ thống tìm sản phẩm phù hợp trong nhóm được phép hiển thị.
3. Người dùng xem kết quả và điều chỉnh filter.
4. Nếu dùng AI Search, AI chỉ hỗ trợ hiểu ý định và gợi ý kết quả dựa trên dữ liệu sản phẩm hợp lệ.

## Purchase Flow / Luồng mua hàng

1. Khách chọn sản phẩm.
2. Khách thêm vào giỏ hàng.
3. Hệ thống kiểm tra lại khả năng bán và điều kiện giá/ưu đãi.
4. Khách nhập thông tin nhận hàng.
5. Khách xác nhận đặt hàng.
6. Đơn hàng được tạo và chuyển sang bước xử lý.

## Payment Flow / Luồng thanh toán

1. Khách chọn phương thức thanh toán.
2. Hệ thống ghi nhận trạng thái thanh toán ban đầu.
3. Nếu thanh toán online, kết quả phải được xác nhận qua Payment Gateway ở phase triển khai sau.
4. Đơn hàng chỉ chuyển trạng thái phù hợp khi điều kiện thanh toán đạt.
5. Thanh toán lỗi cần có hướng dẫn cho khách hoặc staff.

## Order Management Flow / Luồng quản lý đơn hàng

1. Staff xem đơn mới.
2. Staff kiểm tra thông tin khách, sản phẩm, thanh toán và giao hàng.
3. Staff xác nhận hoặc yêu cầu bổ sung thông tin.
4. Staff cập nhật trạng thái xử lý.
5. Đơn hoàn tất, hủy hoặc cần chăm sóc tiếp được ghi nhận rõ lý do.

## Product Management Flow / Luồng quản lý sản phẩm

1. Manager/Admin tạo hoặc cập nhật thông tin sản phẩm.
2. Hệ thống kiểm tra điều kiện nội dung tối thiểu.
3. Media, category, brand và trạng thái bán được xác nhận.
4. Sản phẩm được xuất bản hoặc lưu nháp.
5. Thay đổi quan trọng cần có lịch sử chỉnh sửa.

## Inventory Management Flow / Luồng quản lý kho

1. Staff/Manager xem tồn kho.
2. Cập nhật khả năng bán theo nhập hàng, điều chỉnh hoặc đơn hàng.
3. Hệ thống cảnh báo gần hết hàng.
4. Sản phẩm hết hàng được xử lý theo chính sách hiển thị/đặt trước.
5. Điều chỉnh bất thường cần ghi nhận lý do.

## Customer Care Flow / Luồng chăm sóc khách hàng

1. Khách gửi câu hỏi qua kênh hỗ trợ.
2. Staff hoặc AI Customer Support phân loại nội dung.
3. AI có thể gợi ý câu trả lời nếu đủ dữ liệu.
4. Staff xác nhận phản hồi cho trường hợp nhạy cảm.
5. Kết quả chăm sóc được ghi nhận để cải thiện dịch vụ.

