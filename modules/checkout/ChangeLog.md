# Checkout ChangeLog

## 2026-08-12 — Prompt 27.3

- Verified browser return remains non-authoritative and Result reloads backend Payment state.
- Added MySQL aggregate verification for VNPAY IPN and COD regression.
- Recorded real Sandbox checkout as blocked by missing credentials/public HTTPS IPN callback.

## 2026-08-10 — Prompt 27.2

- Added backend-driven payment method selection for COD and VNPAY.
- Added VNPAY redirect flow, return/result handling and authoritative status query.
- Preserved COD behavior and checkout idempotency boundary.

## 2026-08-09 — Prompt 26.2

- Thay `/checkout` ComingSoon bằng Checkout V1 responsive, accessible.
- Thêm server Shipping quote API integration, COD presentation và real Order confirmation với safe idempotency retry.
- Không clear Cart/count, capture payment, fulfill shipment hoặc mutate Inventory.

## 2026-08-09 — Prompt 26.1B

- Order Creation Boundary READY với transactional persistence, server-authoritative snapshots/totals và idempotency.
- Dependency matrix hoàn tất; Prompt 26.2 được mở khóa.

## 2026-08-09 — Prompt 26 audit

- Xác nhận Checkout BLOCKED bởi Shipping quote authority, Payment method selection và Order creation boundary.
- Không tạo fake Checkout implementation.
