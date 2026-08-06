# Dashboard Feature Specification / Đặc tả tính năng dashboard

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Orders, Products, Inventory, Analytics, Users |
| Version | Version 1 |
| Owner | Manager, Product Owner |
| Status | Draft for business specification |

## Overview / Tổng quan

Dashboard cung cấp cái nhìn nhanh về tình trạng vận hành cửa hàng cho Staff, Manager và Admin.

## Business Goal / Mục tiêu kinh doanh

Giúp đội vận hành biết việc cần xử lý ngay: đơn mới, sản phẩm gần hết, doanh số cơ bản và cảnh báo quan trọng.

## Scope / Phạm vi

Trong phạm vi: tổng quan nghiệp vụ, KPI cơ bản, cảnh báo vận hành, quick links. Ngoài phạm vi: UI dashboard, API metrics, data visualization implementation.

## Requirement / Yêu cầu

- Dashboard hiển thị thông tin phù hợp vai trò.
- Staff thấy tác vụ vận hành cần xử lý.
- Manager thấy chỉ số bán hàng và tồn kho.
- Admin thấy cấu hình hoặc cảnh báo hệ thống liên quan.

## User Story / User story

- Là Staff, tôi muốn thấy đơn cần xử lý.
- Là Manager, tôi muốn thấy doanh số và tồn kho nhanh.
- Là Admin, tôi muốn thấy cảnh báo cấu hình quan trọng.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| View operation summary | Staff | Biết việc cần làm. |
| View business overview | Manager | Nắm tình hình kinh doanh. |
| View admin alerts | Admin | Biết rủi ro cấu hình/quyền. |

## Business Flow / Luồng nghiệp vụ

1. User nội bộ đăng nhập.
2. Hệ thống xác định vai trò.
3. Dashboard hiển thị thông tin phù hợp.
4. User chọn tác vụ cần xử lý.
5. Hệ thống dẫn sang module liên quan ở phase UI sau.

## Validation Rule / Quy tắc validation

- Dashboard không hiển thị dữ liệu vượt quyền.
- Chỉ số phải có phạm vi thời gian rõ.
- Cảnh báo phải có ý nghĩa hành động.

## Permission / Phân quyền

Staff xem vận hành giới hạn. Manager xem business dashboard. Admin xem dashboard quản trị. Super Admin xem platform dashboard khi SaaS.

## Acceptance Criteria / Tiêu chí hoàn thành

- Dashboard có nội dung khác nhau theo vai trò.
- Thông tin ưu tiên hỗ trợ hành động.
- Không lộ dữ liệu ngoài quyền.
- Dashboard sẵn sàng nhận analytics sau này.

## Edge Cases / Trường hợp biên

- User có nhiều vai trò.
- Dữ liệu chưa đủ trong ngày đầu vận hành.
- Cảnh báo quá nhiều gây nhiễu.

## Error Cases / Trường hợp lỗi

- Không đủ quyền xem chỉ số.
- Dữ liệu nguồn không sẵn sàng.
- Cảnh báo sai phạm vi.

## Future Enhancement / Mở rộng tương lai

- Custom dashboard by role.
- AI insight cards.
- SaaS platform dashboard.

