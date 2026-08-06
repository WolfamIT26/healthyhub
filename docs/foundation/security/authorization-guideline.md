# Authorization Guideline / Hướng dẫn phân quyền

## Purpose / Mục tiêu

Authorization xác định một actor được làm gì sau khi đã xác thực. HealthyHub cần phân quyền rõ để bảo vệ admin, dữ liệu khách hàng, đơn hàng, thanh toán và AI action.

## Model / Mô hình

Giai đoạn đầu có thể dùng Role-Based Access Control. Khi nghiệp vụ phức tạp hơn, có thể bổ sung permission chi tiết hoặc policy-based access nếu được ghi nhận trong ADR.

## Role Baseline / Nền role

- Customer: thao tác trên tài khoản và đơn hàng của chính mình.
- Staff: xử lý vận hành theo quyền được cấp.
- Admin: quản lý cấu hình và dữ liệu nhạy cảm theo policy.
- System: tác vụ tự động, webhook hoặc scheduled job.
- AI Agent: thao tác có kiểm soát, phải có log và phạm vi rõ.

## Enforcement Rule / Quy tắc thực thi

Phân quyền phải kiểm tra ở backend. UI chỉ hỗ trợ ẩn/hiện chức năng, không được xem là lớp bảo vệ chính.

## Related / Liên quan

- [Authentication Guideline / Hướng dẫn xác thực](authentication-guideline.md)
- [Audit System / Hệ thống audit](../../../audit/README.md)

