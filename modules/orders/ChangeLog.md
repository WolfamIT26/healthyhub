# Order ChangeLog / Nhật ký thay đổi module đơn hàng

## 2026-08-21 — Prompt 32.1

- Added atomic stock reservation to Order creation and immediate COD consumption.
- Added rollback/concurrent purchase coverage; Order cannot commit without its stock effect.

## 2026-08-21 — Prompt 32

- Audited Order/Checkout/COD/VNPAY lifecycle and kept stock mutation blocked because reserve/deduct/release/cancellation rules are not canonical yet.
- Order create continues server stock revalidation without claiming post-commit oversell protection.

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
