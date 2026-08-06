# Forgot Password Screen / Màn hình quên mật khẩu

## Screen Overview / Tổng quan màn hình

Màn hình quên mật khẩu và đặt lại mật khẩu giúp user lấy lại quyền truy cập an toàn.

## Business Goal / Mục tiêu kinh doanh

Giảm mất tài khoản và bảo vệ thông tin đăng nhập.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/forgot-password` | Yêu cầu reset password. |
| `/reset-password` | Đặt lại password bằng reset token. |

## Permission / Phân quyền

Guest hoặc user chưa xác thực.

## Required API / API bắt buộc

- `POST /api/v1/auth/forgot-password`.
- `POST /api/v1/auth/reset-password`.

## Required Data / Dữ liệu bắt buộc

Email, reset token context, password mới, validation response.

## UI Sections / Khu vực UI

Request reset form, reset password form, success instruction, login link.

## Components / Thành phần

Auth Form, Text Input, Password Input, Submit Button, Validation Message, Toast.

## Form / Form

Forgot form gồm email. Reset form gồm token context, new password và confirm password. Token chỉ ở route/application state rồi gửi trong JSON body, không log hoặc persist client-side.

## Validation / Validation

Email required/format/tối đa 254 ký tự; password 12–128 ký tự, không ép composition, chặn mật khẩu phổ biến; confirm match; reset token required.

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

Invalid/expired/used reset token dùng cùng lỗi an toàn; validation và rate limit có retry guidance. Forgot password luôn hiển thị cùng accepted state, không tiết lộ account.

## Success State / Trạng thái thành công

Hiển thị cùng hướng dẫn kiểm tra email cho mọi request hợp lệ. Reset thành công thu hồi mọi session, xóa refresh cookie và chuyển về login.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Gửi yêu cầu thành công, reset thành công hoặc lỗi an toàn.

## Skeleton / Skeleton

Không cần skeleton.

## Responsive Behavior / Hành vi responsive

Mobile form một cột.

## Accessibility / Khả năng tiếp cận

Label rõ, message không chỉ dựa vào màu, password policy dễ đọc.

## SEO Metadata / SEO metadata

Noindex nếu policy SEO sau này yêu cầu cho auth pages.
