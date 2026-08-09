# Checkout Decisions — Prompt 26

## Decision

**DEPENDENCIES READY — Shipping, Payment and Order executable.**

Ngày audit: 2026-08-09.

## Evidence

1. Checkout UI Contract bắt buộc `POST /cart/validate`, `POST /shipping/quotes` và `POST /orders`.
2. Shipping specification chỉ yêu cầu phí được xác nhận trước khi đặt hàng; không định nghĩa method code, vùng phục vụ, static fee rule hoặc provider executable. API quote vẫn generic và API source không có Shipping implementation.
3. Order physical design đã mô tả tables nhưng chưa có migration/entity/repository/service. `POST /orders` dùng `GenericCommandRequest`, trong khi Order spec bắt buộc idempotency key và revalidation.
4. Prompt 26.1 audit sâu xác nhận Payment physical design dùng `cod` làm default và ghi `bank_transfer/online future`; COD-only có đủ căn cứ làm executable selection foundation.
5. CustomerAddress physical model đã approved nhưng chưa executable. One-time address có thể dùng sau này, nhưng hiện không có Shipping/Order snapshot boundary để lưu an toàn.
6. Cart server persistence và Product/Inventory/Customer ownership đã READY; đây không còn là blocker.

## Boundary decision

- Không thay `/checkout` ComingSoon bằng form không thể hoàn tất.
- Không tạo preview/confirm endpoint thiếu Shipping authority.
- Không tạo Order row, payment success, shipping fee `0`, COD mặc định hoặc fake quote.
- Không sửa Cart/Authentication architecture và không thay authoritative specification bằng assumptions.

## Prompt 26.1B resolution

- Payment Method Foundation: **READY** — COD-only; `pending`, không capture và không fake paid.
- Shipping Authority: **READY** — Prompt 26.1A formalized internal `manual`, `0.00 VND`, VN-only validated serviceability và deterministic stateless quote.
- Order Creation Boundary: **READY** — transactional persistence, immutable snapshots, server totals, Customer ownership và idempotency đã chạy thật trên MySQL.
- Cart lifecycle: giữ active vì chưa có approved transition; Prompt 26.2 phải chốt riêng.

## Required unlock order

1. Triển khai Prompt 26.2 verified-Customer Checkout UI với one-time VN address, `manual` Shipping và COD.
2. Dùng `POST /orders` cùng required idempotency key; không gửi totals/owner/status.
3. Chốt Cart transition theo authoritative rule trước khi mutate Cart.
