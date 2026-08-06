# Customer Orders Screen / Màn hình đơn hàng của tôi

## Screen Overview / Tổng quan màn hình

Màn hình hiển thị lịch sử đơn hàng của customer.

## Business Goal / Mục tiêu kinh doanh

Giúp khách theo dõi đơn, giảm hỏi support và tạo đường dẫn review/mua lại.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/account/orders` | Danh sách đơn của tôi. |

## Permission / Phân quyền

Customer/member/VIP, owner only.

## Required API / API bắt buộc

- `GET /api/v1/me/orders`.

## Required Data / Dữ liệu bắt buộc

Order summary list, orderStatus, paymentStatus, shippingStatus, createdAt, total, pagination metadata.

## UI Sections / Khu vực UI

Order filters, order list, pagination, quick status summary.

## Components / Thành phần

Order Card/List Item, Status Badge, Filter Tabs, Pagination.

## Form / Form

Không có form lưu dữ liệu.

## Validation / Validation

Filter/status/page hợp lệ.

## Search / Tìm kiếm

Search theo order code nếu API cho customer hỗ trợ.

## Filter / Lọc

Lọc theo orderStatus, paymentStatus, shippingStatus, date range nếu API hỗ trợ.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20, max 100 theo Order API.

## Upload / Upload

Không áp dụng.

## Download / Download

Invoice/download nếu có là future enhancement.

## Loading State / Trạng thái tải

Skeleton order list.

## Empty State / Trạng thái rỗng

Chưa có đơn hàng thì hiển thị link mua sản phẩm.

## Error State / Trạng thái lỗi

Session expired hoặc list load failed.

## Success State / Trạng thái thành công

Danh sách đơn và trạng thái hiển thị đúng.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng ở list, hủy đơn nằm ở Order Detail.

## Toast Message / Toast

Không áp dụng thường xuyên.

## Skeleton / Skeleton

Skeleton order cards giữ vùng mã đơn, status và total.

## Responsive Behavior / Hành vi responsive

Mobile dùng card list; desktop có thể dùng table/list ở bước design sau.

## Accessibility / Khả năng tiếp cận

Status badge có text, link detail có mã đơn rõ.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.

