# Checkout Screen / Màn hình đặt hàng

## Screen Overview / Tổng quan màn hình

Checkout cho khách nhập thông tin nhận hàng, chọn vận chuyển/thanh toán, validate giỏ và tạo order.

## Business Goal / Mục tiêu kinh doanh

Hoàn tất đơn hàng nhanh, giảm lỗi thông tin và bảo toàn dữ liệu giá/tồn kho chính xác.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/checkout` | Đặt hàng. |

## Permission / Phân quyền

Guest limited hoặc Customer JWT theo policy.

## Required API / API bắt buộc

- `POST /api/v1/cart/validate`.
- `POST /api/v1/shipping/quotes`.
- `POST /api/v1/orders`.
- `POST /api/v1/payments/intents` nếu chọn thanh toán cần intent.
- `GET /api/v1/me/addresses` nếu customer đăng nhập.

## Required Data / Dữ liệu bắt buộc

Validated cart, customer/address info, shipping quote, payment method, order summary, warnings.

Saved address chỉ prefill Shipping form. Checkout không gửi `addressId` làm Order authority; Order/Shipment luôn persist immutable address snapshot từ form đã validate. Manual entry vẫn khả dụng nếu Address Book trống hoặc load lỗi.

## UI Sections / Khu vực UI

Customer info, address, shipping method/quote, payment method, order summary, confirmation action.

## Components / Thành phần

Checkout Form, Address Selector, Shipping Quote, Payment Method Selector, Order Summary, Confirmation Dialog.

## Form / Form

Recipient name, phone, address, note, shipping choice, payment method.

## Validation / Validation

Required recipient fields, phone format, address completeness, cart still valid, payment method available.

## Search / Tìm kiếm

Không áp dụng.

## Filter / Lọc

Không áp dụng.

## Sort / Sắp xếp

Shipping options theo API priority hoặc price/time nếu được phép.

## Pagination / Phân trang

Không áp dụng.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Loading khi validate cart, lấy shipping quote, tạo order và tạo payment intent.

## Empty State / Trạng thái rỗng

Nếu cart trống, chuyển hoặc link về Product List.

## Error State / Trạng thái lỗi

Cart invalid, item unavailable, shipping invalid, payment provider error hoặc order conflict.

## Success State / Trạng thái thành công

Order tạo thành công, chuyển đến order detail/success state.

## Confirmation Dialog / Hộp xác nhận

Xác nhận đặt hàng trước khi gửi order nếu thông tin đã đủ.

## Toast Message / Toast

Thông báo đặt hàng thành công, lỗi validate cart, lỗi shipping/payment.

## Skeleton / Skeleton

Skeleton order summary và address/shipping section khi tải dữ liệu.

## Responsive Behavior / Hành vi responsive

Mobile một cột, order summary dễ kiểm tra trước submit; desktop có thể chia form và summary ở bước design sau.

## Accessibility / Khả năng tiếp cận

Form field có label, lỗi gắn field, tổng tiền hiển thị text rõ, confirmation trap focus khi triển khai.

## SEO Metadata / SEO metadata

Noindex vì checkout là dữ liệu cá nhân/session.
