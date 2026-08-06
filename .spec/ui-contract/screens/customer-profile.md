# Customer Profile Screen / Màn hình hồ sơ khách hàng

## Screen Overview / Tổng quan màn hình

Màn hình hồ sơ cho customer xem/sửa thông tin cá nhân và quản lý địa chỉ nhận hàng.

## Business Goal / Mục tiêu kinh doanh

Giữ dữ liệu khách hàng chính xác để đặt hàng, giao hàng và chăm sóc tốt hơn.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/account` | Hồ sơ tài khoản. |
| `/account/addresses` | Địa chỉ nhận hàng. |

## Permission / Phân quyền

Customer/member/VIP, owner only.

## Required API / API bắt buộc

- `GET /api/v1/me/profile`.
- `PATCH /api/v1/me/profile`.
- `GET /api/v1/me/addresses`.
- `POST /api/v1/me/addresses`.
- `PATCH /api/v1/me/addresses/{addressId}`.
- `DELETE /api/v1/me/addresses/{addressId}`.

## Required Data / Dữ liệu bắt buộc

Customer profile, address list, validation errors, success metadata.

## UI Sections / Khu vực UI

Profile form, address list, address form dialog, account status summary.

## Components / Thành phần

Profile Form, Address Card, Address Form, Confirmation Dialog, Toast.

## Form / Form

Profile fields và address fields.

## Validation / Validation

Email/phone format, address required fields, owner check, field length.

## Search / Tìm kiếm

Không áp dụng.

## Filter / Lọc

Không áp dụng.

## Sort / Sắp xếp

Address default trước, sau đó updatedAt hoặc createdAt.

## Pagination / Phân trang

Không cần nếu số địa chỉ nhỏ; có thể phân trang nếu API mở rộng.

## Upload / Upload

Avatar nếu có sau này đi qua Media API, chưa bắt buộc.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton profile fields và address cards.

## Empty State / Trạng thái rỗng

Chưa có địa chỉ thì hiển thị action thêm địa chỉ.

## Error State / Trạng thái lỗi

Validation field, permission owner, session expired.

## Success State / Trạng thái thành công

Profile/address cập nhật và hiển thị toast.

## Confirmation Dialog / Hộp xác nhận

Xác nhận xóa địa chỉ.

## Toast Message / Toast

Cập nhật hồ sơ, thêm/sửa/xóa địa chỉ.

## Skeleton / Skeleton

Skeleton form và address cards.

## Responsive Behavior / Hành vi responsive

Mobile form một cột; desktop có thể đặt profile và address song song ở bước design sau.

## Accessibility / Khả năng tiếp cận

Label rõ, lỗi field dễ đọc, address action có tên cụ thể.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.

