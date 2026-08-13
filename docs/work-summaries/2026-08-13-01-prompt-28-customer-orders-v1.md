# Prompt 28 - Customer Orders V1 / Đơn hàng của tôi V1

## Task / Nhiệm vụ

Triển khai Customer Order list/detail hoàn toàn từ Order persistence hiện hữu, bắt buộc owner isolation và không mở Admin/cancel/refund/reorder/fulfillment/inventory/invoice/review/provider mới.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Customer Order API | **PASS** |
| Customer ownership/isolation | **PASS** |
| Order List/Detail frontend | **PASS** |
| COD/VNPAY canonical display | **PASS** |
| Auth/Checkout/Order/Payment regression | **PASS** |
| Browser visual verification | **NOT RUN — in-app Browser control unavailable** |

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

## Added / Đã thêm

- Customer-only `GET /api/v1/me/orders` và `GET /api/v1/me/orders/{orderId}`.
- Owner-scoped repository page/detail query, status/date filter whitelist và stable pagination.
- `/orders`, `/orders/:orderId`, Order API/types/presentation mapping và Customer navigation.
- API/frontend/MySQL tests cho empty/populated/filter/page/detail/COD/VNPAY/Guest/Internal/not-owned/direct route/responsive structure.
- Đủ bộ tài liệu bắt buộc trong `modules/orders`.

## Updated / Đã cập nhật

- Typed OpenAPI list/detail response và exact query parameters; operation count giữ 196.
- Checkout success và Payment Result link tới persisted Order detail.
- Order/Checkout/Payment/Shipping docs, UI route contract, root ChangeLog/tổng hợp và Work Summary index.
- TypeScript nullability của Shipment tracking/timestamps để phản ánh đúng schema hiện hữu; không đổi database.

## Security / Bảo mật

- Customer owner derive từ JWT → CustomerProfile; API không nhận `customerId`.
- Tenant/customer constraint áp dụng ở query; invalid/not-owned detail cùng trả `404 ORDER.NOT_FOUND`.
- Guest bị AccessToken guard chặn; internal account bị Customer role/owner policy chặn.
- Response không chứa VNPAY signature/hash secret/raw callback/provider-event hoặc internal actor metadata. Provider reference chỉ trả dạng an toàn đã được Payment contract cho phép.

## Verification / Kiểm tra

- API unit: **PASS — 140 tests**.
- Web unit: **PASS — 114 tests**.
- Full workspace unit: **PASS — 254 tests**.
- MySQL integration: **PASS — 7 files / 10 tests**.
- Workspace typecheck: **PASS**.
- Workspace lint: **PASS**.
- Workspace build: **PASS**.
- OpenAPI validation: **PASS — 196 operations / 196 spec rows**.
- Secrets check: **PASS**.
- Documentation check: **PASS**.
- `git diff --check`: **PASS**.
- Production preview direct route: **PASS — `/`, `/orders`, `/orders/42` trả `200 text/html`**.
- Browser visual: **NOT RUN** vì runtime không expose in-app Browser control; không fake PASS. Direct route/reload và responsive class structure đã pass frontend tests.

## Not Changed / Không thay đổi

- Không migration/schema change, Order/Payment/Shipping mutation hoặc Cart lifecycle change.
- Không sửa VNPAY browser-return/IPN authority, không fake `paid`, không dùng credential.
- Không triển khai Admin Order Management, cancel, refund, reorder, fulfillment, inventory mutation, invoice, review hoặc provider mới.

## Stop Boundary / Điểm dừng

Prompt 28 hoàn tất và dừng tại đây; không bắt đầu Prompt 29.
