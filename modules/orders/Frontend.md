# Order Frontend / Giao diện module đơn hàng

## Screens / Màn hình

- `/orders`: list, filter trạng thái, pagination, loading/empty/error và link chi tiết.
- `/orders/:orderId`: status, item/price snapshots, shipping address, Payment summary, totals và breadcrumb/back navigation.

## State / Trạng thái

Mỗi lần mount/reload đều gọi server. Page/filter nằm trong URL query; detail lấy `orderId` từ route. UI không suy luận `paid` từ VNPAY return và có fallback label cho enum chưa biết.

## Responsive / Đáp ứng

List dùng card stack trên mobile; detail một cột trên mobile và content/summary hai cột ở desktop. Control có touch target và accessible label.
