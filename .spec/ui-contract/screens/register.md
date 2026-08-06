# Register Screen / Màn hình đăng ký

## Screen Overview / Tổng quan màn hình

Màn hình đăng ký tạo tài khoản customer/member theo policy HealthyHub.

## Business Goal / Mục tiêu kinh doanh

Tạo tài khoản khách hàng để theo dõi đơn hàng, nhận chăm sóc và dùng loyalty/AI cá nhân hóa sau này.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/register` | Đăng ký tài khoản. |
| `/verify-email` | Xác minh email nếu cần. |

## Permission / Phân quyền

Guest.

## Required API / API bắt buộc

- `POST /api/v1/auth/register`.
- `POST /api/v1/auth/verify-email`.
- `POST /api/v1/auth/resend-verification`.

## Required Data / Dữ liệu bắt buộc

Register input, auth status, verification status, error/validation response.

## UI Sections / Khu vực UI

Register form, policy consent nếu có, login link, verify email state.

## Components / Thành phần

Auth Form, Text Input, Password Input, Checkbox, Submit Button, Validation Message.

## Form / Form

Tên, email, password và confirm password. Phone không là login identifier V1; consent chỉ thêm khi Legal contract yêu cầu.

## Validation / Validation

Tên/email/password/confirm required; email format tối đa 254 ký tự; password 12–128 ký tự, hỗ trợ Unicode/space, không ép composition; confirm phải khớp và không gửi API. Hiển thị hướng dẫn mật khẩu phổ biến không được dùng.

## Search / Tìm kiếm

Không áp dụng.

## Filter / Lọc

Không áp dụng.

## Sort / Sắp xếp

Không áp dụng.

## Pagination / Phân trang

Không áp dụng.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Disable submit khi đang gửi.

## Empty State / Trạng thái rỗng

Không áp dụng.

## Error State / Trạng thái lỗi

Email trùng chỉ xuất hiện trong register, cùng validation/rate-limit hoặc verify token invalid; không hiển thị token raw.

## Success State / Trạng thái thành công

Luôn hiển thị yêu cầu xác minh email; account chưa xác minh không đăng nhập V1.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Đăng ký thành công, gửi lại email xác minh thành công hoặc lỗi.

## Skeleton / Skeleton

Không cần skeleton.

## Responsive Behavior / Hành vi responsive

Mobile form một cột, link phụ rõ ràng.

## Accessibility / Khả năng tiếp cận

Label rõ, lỗi field rõ, password policy mô tả bằng text.

## SEO Metadata / SEO metadata

Noindex nếu policy SEO sau này yêu cầu cho auth pages.
