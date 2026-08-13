# Order Requirement / Yêu cầu module đơn hàng

## Goal / Mục tiêu

Customer xem lịch sử và chi tiết Order persisted của chính mình; server không tin owner, giá hoặc trạng thái do frontend gửi.

## Acceptance Criteria / Tiêu chí hoàn thành

- [x] Customer-only list/detail với owner check server-side.
- [x] Pagination mặc định 20, tối đa 100 và filter whitelist.
- [x] Item/price/address/shipping/payment snapshot hiển thị từ database.
- [x] COD/VNPAY dùng canonical Payment status.
- [x] Guest/Internal/not-owned bị chặn không lộ dữ liệu.
- [x] Direct URL/reload tải lại từ server.

## Exclusions / Ngoài phạm vi

Admin management, cancellation, refund, reorder, fulfillment, inventory mutation, invoice và review.
