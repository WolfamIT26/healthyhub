# Login Screen / Màn hình đăng nhập

## Screen Overview / Tổng quan màn hình

Màn hình đăng nhập cho customer và staff/admin truy cập trải nghiệm phù hợp theo role.

## Business Goal / Mục tiêu kinh doanh

Cho phép người dùng đăng nhập an toàn, giảm lỗi đăng nhập và điều hướng đúng sau khi xác thực.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/login` | Đăng nhập. |

## Permission / Phân quyền

Guest. User đã đăng nhập nên được chuyển đến account hoặc admin theo role.

## Required API / API bắt buộc

- `POST /api/v1/auth/login`.
- `GET /api/v1/auth/session` sau khi login nếu cần đồng bộ session.

## Required Data / Dữ liệu bắt buộc

Credential input, auth status, actor summary, role summary, token metadata.

## UI Sections / Khu vực UI

Login form, forgot password link, register link, error summary.

## Components / Thành phần

Auth Form, Text Input, Password Input, Submit Button, Validation Message, Toast.

## Form / Form

Email và password. Email được trim/lowercase để lookup; phone/username không phải định danh đăng nhập V1.

## Validation / Validation

Email required/đúng format/tối đa 254 ký tự; password required. Không normalize hoặc trim password.

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

Disable submit và hiển thị loading trong khi login.

## Empty State / Trạng thái rỗng

Không áp dụng.

## Error State / Trạng thái lỗi

Mọi lỗi account không tồn tại, sai password, locked, disabled hoặc chưa verify dùng cùng thông báo đăng nhập không thành công. Rate limit có hướng dẫn thử lại an toàn; không hiển thị account tồn tại hay không.

## Success State / Trạng thái thành công

Điều hướng về intended route, account hoặc admin dashboard theo role.

Web giữ access token trong memory, nhận refresh token chỉ qua cookie `__Host-hh_refresh` HttpOnly/Secure/SameSite=Lax. Không dùng localStorage/sessionStorage. Token response không cache. Khi access token hết hạn, chỉ một refresh request kèm CSRF header được chạy; thất bại thì xóa auth state và chuyển về login.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Đăng nhập thành công hoặc lỗi đăng nhập thân thiện.

## Skeleton / Skeleton

Không cần skeleton, form render tĩnh.

## Responsive Behavior / Hành vi responsive

Mobile form một cột; desktop giữ form gọn và dễ nhập.

## Accessibility / Khả năng tiếp cận

Field có label, lỗi gắn với field, password visibility control cần label khi triển khai.

## SEO Metadata / SEO metadata

Noindex nếu policy SEO sau này yêu cầu cho auth pages.
