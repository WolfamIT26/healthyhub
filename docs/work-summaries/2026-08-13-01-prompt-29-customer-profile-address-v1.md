# Prompt 29 - Customer Profile & Address V1 / Hồ sơ và địa chỉ Customer V1

## Task / Nhiệm vụ

Triển khai My Account Profile/Address từ persistence thật, owner-only, tích hợp Checkout bằng prefill và giữ immutable Order snapshot; không mở các feature ngoài Prompt 29 hoặc Prompt 30.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Customer Profile | **READY** |
| Address Persistence | **READY** |
| Address CRUD | **READY** |
| Checkout Address Integration | **READY** |
| Ownership/Security | **PASS** |
| Regression | **PASS** |
| Browser Visual Verification | **NOT RUN — in-app Browser/Node REPL connector unavailable** |

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

## Implemented / Đã triển khai

- Customer-only `GET/PATCH /api/v1/me/profile`; editable boundary `fullName`, `phone`, Authentication email read-only.
- `customer_addresses` migration/entity/repository và owner-scoped list/create/update/soft-delete/default behavior.
- `/account/profile`, `/account/addresses`, responsive account navigation, loading/empty/error/validation/success UI.
- Checkout chọn default/saved Address để prefill hoặc nhập tay; request Order không gửi saved Address ID.
- Typed OpenAPI Customer schemas; exact non-paginated Profile/Address reads, safe response field boundary.

## Security & Persistence / Bảo mật và persistence

- Owner derive từ JWT → active CustomerProfile; không nhận `customerId`; Guest nhận 401, Internal bị 403, not-owned Address trả 404.
- Global whitelist/forbid validation từ chối email/customerId/role/audit mass assignment; response không chứa internal IDs, raw key/hash hoặc metadata nhạy cảm.
- Một active default được bảo vệ bằng transaction/row lock và generated unique constraint. Create lưu SHA-256 key/request hash, không lưu raw idempotency key.
- MySQL integration chứng minh sửa saved Address không thay đổi `shipping_addresses.address_text` của Order/Shipment đã persist.

## Regression Bug Fixed / Lỗi regression đã sửa

- `PaymentFoundationModule` chưa export provider `HealthyHubEnvironment`, làm API bootstrap không resolve được dependency của PaymentService. Đã export provider hiện hữu; không đổi Payment/VNPAY business logic.

## Verification / Kiểm tra

- API unit: **PASS — 141 tests**.
- Web unit: **PASS — 111 tests**.
- Full workspace unit: **PASS — 252 tests**.
- MySQL integration: **PASS — 7 files / 10 tests**.
- Workspace lint/typecheck/build: **PASS**.
- OpenAPI validation: **PASS — 196 operations / 196 spec rows**.
- Secrets/documentation checks: **PASS**.
- API startup/health and Guest guards: **PASS — health 200, self APIs 401 without token**.
- Direct routes/reload fallback: **PASS — `/account/profile`, `/account/addresses` return 200 HTML**.
- Final migration state: **PASS — 9/9 migrations applied**.
- `git diff --check`: **PASS**.
- Browser visual: **NOT RUN** because the runtime exposes no in-app Browser/Node REPL connector; no fake PASS.

## Not Changed / Không thay đổi

- Không Change Email/Password/Delete Account, Admin Customer Management, loyalty, cards, Order mutation, geography catalog hoặc AI advisor.
- Không đổi Shipping fee authority, Payment state, VNPAY return/IPN authority, database Order snapshot semantics hoặc API route inventory.

## Stop Boundary / Điểm dừng

Prompt 29 hoàn tất và dừng; không bắt đầu Prompt 30.
