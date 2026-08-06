# Security Guideline / Hướng dẫn bảo mật

## Security Baseline / Nền bảo mật

HealthyHub phải xem bảo mật là yêu cầu mặc định trong mọi module, không phải phần thêm sau. Các luồng liên quan tài khoản, đơn hàng, thanh toán, dữ liệu cá nhân, AI upload và admin action phải có kiểm soát rõ.

## Required Controls / Kiểm soát bắt buộc

- Authentication cho danh tính người dùng.
- Authorization cho quyền truy cập.
- JWT hoặc session policy có thời hạn và cơ chế thu hồi phù hợp.
- Validation ở biên hệ thống.
- SQL Injection Protection bằng query parameterization hoặc ORM/query builder an toàn.
- XSS Protection bằng escaping, sanitization và CSP khi triển khai.
- CSRF Protection cho luồng dùng cookie/session.
- Rate Limit cho API nhạy cảm.
- Environment Security và Secret Management.
- Audit logging cho hành động quan trọng.
- Data Privacy cho thông tin cá nhân và dữ liệu sức khỏe.

## AI Security / Bảo mật AI

AI request không được gửi secret, token, mật khẩu, thông tin thanh toán hoặc dữ liệu cá nhân nhạy cảm nếu chưa có policy. AI output dùng cho tư vấn sức khỏe phải có giới hạn trách nhiệm và không thay thế chuyên gia y tế.

## Related / Liên quan

- [Secret Management Guideline / Quản lý secret](secret-management-guideline.md)
- [AI Gateway / Cổng AI](../ai/ai-gateway.md)

