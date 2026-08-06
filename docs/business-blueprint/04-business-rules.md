# Business Rules / Quy tắc nghiệp vụ

## Overview / Tổng quan

Business Rules mô tả điều kiện và ràng buộc nghiệp vụ. Tài liệu này không mô tả database schema, API endpoint hoặc UI component.

## Product Rules / Quy tắc sản phẩm

- Sản phẩm chỉ được bán khi ở trạng thái cho phép bán và có đủ điều kiện hiển thị.
- Sản phẩm healthy phải có mô tả rõ ràng, hình ảnh phù hợp và thông tin thành phần khi có.
- Sản phẩm hết hàng không được đặt mua như hàng còn sẵn, trừ khi cửa hàng bật chính sách đặt trước.
- Sản phẩm có cảnh báo dị ứng hoặc lưu ý sử dụng phải hiển thị trong nội dung sản phẩm.

## Category Rules / Quy tắc danh mục

- Một sản phẩm phải có ít nhất một nhóm phân loại chính khi được bán công khai.
- Danh mục cần dễ hiểu với khách hàng phổ thông.
- Không để danh mục trùng nghĩa gây rối trải nghiệm tìm kiếm.

## Brand Rules / Quy tắc thương hiệu

- Thương hiệu phải có tên rõ ràng trước khi gắn với sản phẩm.
- Thương hiệu có chứng nhận hoặc nguồn gốc đặc biệt cần được quản lý như thông tin tham chiếu.
- Không dùng thương hiệu sai lệch so với thông tin nhà cung cấp.

## Inventory Rules / Quy tắc tồn kho

- Tồn kho phải phản ánh khả năng bán thực tế.
- Khi đơn hàng được xác nhận, hệ thống phải giảm khả năng bán theo rule đã chọn ở phase thiết kế sau.
- Sản phẩm gần hết hàng cần có cảnh báo cho staff hoặc manager.
- Hủy đơn hoặc trả hàng phải có quy tắc hoàn tồn kho rõ ràng ở đặc tả sau.

## Order Rules / Quy tắc đơn hàng

- Đơn hàng phải có khách đặt, sản phẩm, thông tin nhận hàng và trạng thái xử lý.
- Đơn hàng chỉ được chuyển sang hoàn tất khi đã đủ điều kiện giao hàng/thanh toán theo chính sách cửa hàng.
- Đơn hàng bị hủy phải ghi lý do để phục vụ chăm sóc khách và phân tích.
- Staff chỉ xử lý đơn trong phạm vi quyền được cấp.

## Cart Rules / Quy tắc giỏ hàng

- Giỏ hàng phải kiểm tra lại khả năng bán trước khi đặt hàng.
- Giá và ưu đãi trong giỏ hàng cần được xác nhận lại ở bước đặt hàng.
- Khách chưa đăng nhập có thể dùng giỏ hàng tạm nếu hệ thống hỗ trợ.

## Coupon Rules / Quy tắc coupon

- Coupon chỉ hợp lệ khi còn thời gian, còn điều kiện sử dụng và chưa vượt giới hạn.
- Một coupon có thể có điều kiện theo đơn hàng, sản phẩm, khách hàng hoặc chiến dịch.
- Coupon không được áp dụng nếu làm sai chính sách giá tối thiểu của cửa hàng.

## Promotion Rules / Quy tắc khuyến mãi

- Promotion phải có thời gian hiệu lực rõ ràng.
- Khi nhiều promotion cùng áp dụng, cần có rule ưu tiên hoặc cộng dồn.
- Promotion đã chạy cần hạn chế chỉnh sửa để tránh sai lệch báo cáo.

## Payment Rules / Quy tắc thanh toán

- Đơn hàng phải có trạng thái thanh toán rõ ràng.
- Thanh toán online nếu triển khai sau phải được xác nhận qua Payment Gateway.
- Không giao hàng như đã thanh toán nếu trạng thái thanh toán chưa đạt điều kiện.
- Hoàn tiền hoặc điều chỉnh thanh toán phải có quyền phù hợp và audit log.

## Shipping Rules / Quy tắc giao hàng

- Địa chỉ nhận hàng phải đủ thông tin để giao.
- Phí giao hàng cần được xác nhận trước khi khách hoàn tất đặt hàng.
- Thay đổi địa chỉ sau khi xử lý đơn phải có quyền và ghi nhận lý do.

## Customer Rules / Quy tắc khách hàng

- Thông tin khách hàng phải được bảo vệ theo privacy guideline.
- Khách hàng có thể xem lịch sử đơn của chính mình.
- Staff chỉ xem thông tin khách hàng cần thiết cho vận hành.
- Dữ liệu khách hàng không được dùng cho AI hoặc marketing nếu chưa có chính sách phù hợp.

## Loyalty Rules / Quy tắc thành viên

- Điểm hoặc cấp bậc chỉ phát sinh từ hành vi hợp lệ.
- Hoàn/hủy đơn phải có quy tắc điều chỉnh điểm.
- VIP Customer cần tiêu chí rõ và có thể audit.

## AI Rules / Quy tắc AI nghiệp vụ

- AI chỉ hỗ trợ ra quyết định, không tự quyết định thay staff/admin ở luồng rủi ro.
- AI nutrition không được đưa ra chẩn đoán hoặc chỉ định y tế.
- AI recommendation phải dựa trên dữ liệu có nguồn và tránh gợi ý sản phẩm không phù hợp cảnh báo dị ứng.
- AI output cần có fallback khi thiếu dữ liệu hoặc độ tin cậy thấp.

## Notification Rules / Quy tắc thông báo

- Thông báo liên quan tài khoản, đơn hàng và bảo mật được ưu tiên hơn marketing.
- Marketing notification phải tôn trọng lựa chọn nhận thông tin của khách.
- Nội dung thông báo phải rõ hành động cần làm.

## Review Rules / Quy tắc đánh giá

- Chỉ khách có trải nghiệm mua hàng hợp lệ mới được ưu tiên đánh giá sản phẩm.
- Review vi phạm chính sách nội dung phải được ẩn hoặc kiểm duyệt.
- Review không được chỉnh sửa làm sai ý kiến khách hàng.

## Blog Rules / Quy tắc blog

- Nội dung blog phải hỗ trợ hiểu biết healthy nhưng không thay thế tư vấn y tế.
- Bài viết liên quan sản phẩm cần tránh quảng cáo sai lệch.
- Nội dung SEO phải tự nhiên, không nhồi từ khóa.

## Media Rules / Quy tắc media

- Ảnh sản phẩm phải rõ, đúng sản phẩm và không gây hiểu nhầm.
- File chứng nhận hoặc tài liệu nhạy cảm cần kiểm soát quyền xem.
- Media không dùng nữa cần có quy trình ẩn hoặc lưu trữ.

## Analytics Rules / Quy tắc analytics

- Báo cáo phải dựa trên dữ liệu vận hành đáng tin cậy.
- Dữ liệu cá nhân trong analytics cần được giảm thiểu hoặc ẩn danh khi phù hợp.
- AI analytics chỉ đưa ra gợi ý, manager vẫn là người quyết định.

## Settings Rules / Quy tắc cấu hình

- Chỉ admin hoặc vai trò được cấp quyền mới thay đổi cấu hình quan trọng.
- Thay đổi cấu hình ảnh hưởng đơn hàng, thanh toán, giao hàng hoặc bảo mật phải có audit log.
- Cấu hình SaaS tương lai phải tách rõ cấu hình cửa hàng và cấu hình nền tảng.

