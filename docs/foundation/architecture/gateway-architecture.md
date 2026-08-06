# Gateway Architecture / Kiến trúc gateway

## Purpose / Mục tiêu

Gateway Layer che giấu chi tiết của hệ thống hoặc provider bên ngoài. Business Layer chỉ làm việc với contract ổn định, không phụ thuộc trực tiếp vào SDK, API key, request format hoặc lỗi riêng của provider.

## Planned Gateways / Gateway dự kiến

| Gateway / Cổng | Responsibility / Trách nhiệm |
| --- | --- |
| AI Gateway | Điều phối request tới AI provider, quản lý policy, log và lỗi. |
| Payment Gateway | Bao bọc thanh toán, hoàn tiền, webhook và trạng thái giao dịch. |
| Storage Gateway | Quản lý upload, đọc file, xóa file và quyền truy cập file. |
| Notification Gateway | Gửi email, SMS, push, Zalo và in-app notification. |
| OCR Gateway | Trích xuất chữ từ ảnh hoặc tài liệu. |
| Vision Gateway | Nhận diện ảnh sản phẩm, QR hoặc ảnh món ăn. |
| Analytics Gateway | Gửi event, conversion và dữ liệu đo lường. |
| Integration Gateway | Kết nối hệ thống bên thứ ba khác. |

## Gateway Contract / Hợp đồng gateway

Mỗi gateway khi triển khai phải có:

- Input và output rõ ràng.
- Error mapping thống nhất.
- Timeout và retry rule.
- Logging và audit rule.
- Security rule cho secret và dữ liệu nhạy cảm.
- Test strategy cho success, failure và provider unavailable.

## Related / Liên quan

- [AI Gateway / Cổng AI](../ai/ai-gateway.md)
- [Security Guideline / Hướng dẫn bảo mật](../security/security-guideline.md)

