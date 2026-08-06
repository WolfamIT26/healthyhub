# Users Feature Specification / Đặc tả tính năng người dùng và phân quyền

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Authentication, Settings |
| Version | MVP |
| Owner | Product Owner, Security Agent |
| Status | Draft for business specification |

## Overview / Tổng quan

Users quản lý tài khoản nội bộ, vai trò và phạm vi quyền của Staff, Manager, Administrator và Super Admin tương lai.

## Business Goal / Mục tiêu kinh doanh

Giúp cửa hàng vận hành an toàn bằng cách cấp đúng quyền cho đúng người và chuẩn bị nền tảng phân quyền SaaS.

## Scope / Phạm vi

Trong phạm vi: quản lý user nội bộ, role, trạng thái tài khoản, phân quyền cấp cao. Ngoài phạm vi: database permission model, API quản trị, màn hình quản lý user.

## Requirement / Yêu cầu

- Admin có thể quản lý tài khoản staff/manager.
- Mỗi user nội bộ phải có vai trò rõ.
- User bị vô hiệu hóa không được thao tác.
- Thay đổi quyền quan trọng phải có audit log ở giai đoạn triển khai.
- Super Admin được chuẩn bị cho SaaS nhưng không là trọng tâm MVP.

## User Story / User story

- Là Admin, tôi muốn tạo tài khoản Staff để nhân sự xử lý đơn.
- Là Manager, tôi muốn staff chỉ thấy chức năng cần cho vận hành.
- Là Super Admin tương lai, tôi muốn quản lý tenant và quyền nền tảng.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Create staff user | Admin | Staff có tài khoản vận hành. |
| Assign role | Admin | User có quyền đúng vai trò. |
| Disable user | Admin | User không còn quyền truy cập. |
| Review permissions | Manager, Admin | Quyền được kiểm tra định kỳ. |

## Business Flow / Luồng nghiệp vụ

1. Admin tạo hoặc chọn user.
2. Admin gán vai trò phù hợp.
3. Hệ thống kiểm tra quyền người thực hiện.
4. User nhận quyền theo vai trò.
5. Thay đổi quan trọng được ghi nhận để audit sau này.

## Validation Rule / Quy tắc validation

- User nội bộ phải có vai trò.
- Không được tự hạ quyền admin cuối cùng nếu làm mất quyền quản trị.
- Staff không được cấp quyền cấu hình hệ thống.
- Super Admin chỉ dùng khi bật mô hình SaaS tương lai.

## Permission / Phân quyền

Admin quản lý user nội bộ. Manager có thể xem hoặc đề xuất theo chính sách. Staff không quản lý quyền. Super Admin quản lý cấp nền tảng khi SaaS hoạt động.

## Acceptance Criteria / Tiêu chí hoàn thành

- Vai trò được phân biệt rõ.
- Quyền quan trọng không cấp nhầm cho Staff.
- User bị vô hiệu hóa không thể thao tác.
- Thay đổi quyền có yêu cầu audit.
- SaaS readiness được ghi nhận.

## Edge Cases / Trường hợp biên

- Admin cố xóa tài khoản admin duy nhất.
- Staff được chuyển vai trò khi đang xử lý đơn.
- User bị khóa nhưng còn phiên đăng nhập.

## Error Cases / Trường hợp lỗi

- Vai trò không hợp lệ.
- Người thao tác không đủ quyền.
- User mục tiêu không tồn tại.
- Thay đổi quyền mâu thuẫn chính sách.

## Future Enhancement / Mở rộng tương lai

- Permission chi tiết theo từng capability.
- Approval flow khi cấp quyền nhạy cảm.
- Tenant-level user management cho SaaS.
- Lịch sử thay đổi quyền có báo cáo riêng.

