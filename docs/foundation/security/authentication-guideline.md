# Authentication Guideline / Hướng dẫn xác thực

## Purpose / Mục tiêu

Authentication xác định người dùng là ai. HealthyHub cần chuẩn bị cho khách hàng, admin, staff và AI/system actor trong tương lai.

## Baseline Rule / Quy tắc nền

- Mật khẩu không được lưu dạng plain text.
- Login phải có rate limit và logging cho thất bại bất thường.
- Token phải có thời hạn.
- Refresh token nếu dùng phải có cơ chế thu hồi.
- Verify email và reset password phải dùng token một lần, hết hạn rõ ràng.
- Session hoặc token bị nghi ngờ lộ phải có cách vô hiệu hóa.

## Account Lifecycle / Vòng đời tài khoản

Tài khoản cần có trạng thái rõ: mới tạo, đã xác minh, bị khóa, bị vô hiệu hóa hoặc xóa theo chính sách dữ liệu. Mọi thay đổi trạng thái quan trọng phải có audit log.

## AI Agent Rule / Quy tắc cho AI Agent

AI Agent không được tự thiết kế chi tiết auth flow khi chưa có `.spec` hoặc ADR liên quan. Tài liệu này chỉ đặt baseline bảo mật.

## Related / Liên quan

- [Authorization Guideline / Hướng dẫn phân quyền](authorization-guideline.md)
- [Security Guideline / Hướng dẫn bảo mật](security-guideline.md)

