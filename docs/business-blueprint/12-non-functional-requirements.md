# Non Functional Requirements / Yêu cầu phi chức năng

## Security / Bảo mật

- Bảo vệ tài khoản, quyền, thông tin khách hàng, đơn hàng và dữ liệu thanh toán.
- Các hành động quản trị quan trọng cần audit log.
- Secret và dữ liệu nhạy cảm không được đưa vào prompt AI.
- AI output liên quan dinh dưỡng cần disclaimer và kiểm soát rủi ro.

## Performance / Hiệu năng

- Trải nghiệm xem sản phẩm và tìm kiếm phải phản hồi nhanh ở điều kiện sử dụng thông thường.
- Danh sách lớn phải có phân trang hoặc cơ chế tải hợp lý khi thiết kế sau.
- Hình ảnh sản phẩm cần tối ưu để không làm chậm trải nghiệm mua hàng.
- AI feature cần có timeout và fallback.

## Scalability / Khả năng mở rộng

- Module phải giữ ranh giới rõ để có thể tách service trong tương lai.
- Business design không khóa vào một cửa hàng duy nhất.
- Settings, analytics và permission cần chuẩn bị cho multi-store/SaaS.

## Availability / Khả dụng

- Luồng mua hàng, quản lý đơn và xem sản phẩm là luồng ưu tiên cao.
- Sự cố AI không được làm hệ thống bán hàng chính ngừng hoạt động.
- Khi tích hợp payment/shipping sau này, cần fallback vận hành.

## Maintainability / Dễ bảo trì

- Tài liệu nghiệp vụ phải được cập nhật trước khi thiết kế kỹ thuật.
- Module, feature, rule và version planning phải có liên kết rõ.
- Không trộn logic nghiệp vụ của nhiều module nếu không có contract.

## Accessibility / Khả năng tiếp cận

- Nội dung tiếng Việt rõ, dễ đọc.
- Luồng mua hàng cần dễ dùng cho người không rành công nghệ.
- Màu sắc, text và trạng thái lỗi cần hỗ trợ khả năng đọc tốt khi thiết kế UI sau này.

## SEO / Tối ưu tìm kiếm

- Sản phẩm và blog cần có nội dung hữu ích, tự nhiên và không nhồi từ khóa.
- Category và product content phải hỗ trợ khách hiểu đúng sản phẩm healthy.
- Media cần tên và mô tả phù hợp khi thiết kế SEO sau này.

## Responsive / Tương thích thiết bị

- Web-first nhưng phải chuẩn bị trải nghiệm mobile viewport.
- Luồng tìm kiếm, xem sản phẩm, giỏ hàng và đặt hàng phải phù hợp màn hình nhỏ.
- Mobile app được chuẩn bị sau, không triển khai trong blueprint này.

## AI Readiness / Sẵn sàng AI

- Có knowledge base nội bộ được quản lý.
- Có prompt, context pack, safety rule và fallback.
- Có cách review AI output trước khi dùng cho nội dung nhạy cảm.
- Có logging và giới hạn dữ liệu cho AI feature.

