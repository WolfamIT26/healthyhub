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
- [x] COD fulfillment được phép khi Payment pending; VNPAY yêu cầu verified paid/confirmed.
- [x] Delivery atomically persist Shipment delivered evidence và Order completed evidence.
- [x] Duplicate/concurrent transition idempotent; invalid/chronology-regressive transition bị reject.
- [x] Cancel trước shipment và full return sau delivered nối đúng Inventory release/restock.
- [x] Review eligibility resolver owner-scope theo Order + Product.

## Exclusions / Ngoài phạm vi

Full Admin management UI/API, Customer self-cancellation API, provider refund execution, reorder, invoice và Review persistence/API/UI.
