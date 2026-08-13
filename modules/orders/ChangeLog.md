# Order ChangeLog / Nhật ký thay đổi module đơn hàng

## 2026-08-13 — Prompt 28

### Added / Thêm mới

- Customer-only persisted Order list/detail API, pagination và status/date filters.
- Responsive `/orders` và `/orders/:orderId`, Customer navigation và server reload behavior.
- Unit, frontend và MySQL persistence/ownership tests.

### Security / Bảo mật

- Owner derive từ JWT/CustomerProfile; not-owned trả 404.
- Không expose VNPAY signature, credential, raw callback/event hoặc internal metadata.

### Unchanged / Không đổi

- COD/VNPAY authority, IPN behavior và Sandbox E2E conclusion.
