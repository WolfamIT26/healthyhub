# Prompt 27.3 - VNPAY Sandbox E2E Verification / Xác minh E2E VNPAY Sandbox

## Task / Nhiệm vụ

Audit và verify integration Prompt 27–27.2 theo official VNPAY contract; không dùng secret, không fake E2E PASS và không mở Prompt 28.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| VNPAY Automated Verification | **PASS** |
| VNPAY Sandbox E2E | **BLOCKED — SANDBOX CREDENTIALS REQUIRED** |
| Real VNPAY IPN | **BLOCKED — SANDBOX CREDENTIALS/PUBLIC HTTPS CALLBACK REQUIRED** |
| Payment → Order Mapping | **PASS** |
| COD Regression | **PASS** |

Runtime và ba file môi trường local chưa chọn `PAYMENT_PROVIDER=vnpay` và còn thiếu `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_PAYMENT_URL`, `VNPAY_API_URL`, `VNPAY_RETURN_URL`, `VNPAY_IPN_URL`. Không có giá trị secret nào được đọc ra, ghi vào tài liệu hoặc commit.

## Bugs Fixed / Lỗi đã sửa

- Canonical checksum chưa URL-encode giống query string official.
- Browser return có thể apply `paid` trực tiếp thay vì read-only.
- Nhiều response/transaction status thất bại bị giữ sai ở `pending`.
- Callback chưa verify configured terminal và có thể resolve sai/latest attempt khi có nhiều attempt.
- Provider reference/order info chưa tuân thủ alphanumeric boundary; QueryDr thiếu timeout và response reference/terminal check.
- Provider-event payload hash phụ thuộc query order và concurrent unprocessed delivery có thể được acknowledgment quá sớm.
- Payment/Order update dùng aggregate stale; đã reload với row locks và chỉ map `new → confirmed`.
- Docker API chưa forward VNPAY environment; OpenAPI chưa mô tả signed query fields.

## Database Verification / Xác minh cơ sở dữ liệu

MySQL integration đã kiểm tra:

- Order và immutable OrderItem snapshot;
- Payment amount/status/provider reference;
- đúng PaymentAttempt, amount, provider transaction number và terminal state;
- Shipment cùng address snapshot không đổi;
- failed amount-mismatch event và processed valid event chỉ lưu payload hash;
- browser return không tạo event/không mutate;
- duplicate valid IPN không tạo thêm event hoặc double effect;
- COD vẫn `new/pending`, provider reference null và không có attempt.

Hai migration Prompt 27.2 còn pending trên development database đã được apply trước verification: `EnableVnpaySandbox1760000006000` và `EnableOrderConfirmation1760000007000`.

## Added / Đã thêm

- `apps/api/src/presentation/payment/payment.service.spec.ts`
- `apps/api/tests/integration/vnpay-payment-flow.integration.spec.ts`
- Work Summary này.

## Updated / Đã cập nhật

- VNPAY gateway/service/config/controller tests, Docker env forwarding và frontend Return regression.
- Payment/Checkout/Order docs và module Status/Report/Checklist/ChangeLog/Testing/API/Security liên quan.
- Payment API specification và OpenAPI VNPAY query parameters/authority notes.
- Root ChangeLog, tổng hợp và Work Summary index.

## Verification / Kiểm tra

- API unit: **PASS — 131 tests**.
- Web unit: **PASS — 102 tests**.
- MySQL relevant integration: **PASS — 3 tests**.
- Workspace typecheck: **PASS**.
- Workspace lint: **PASS**.
- OpenAPI validation: **PASS — 196 operations / 196 spec rows**.
- Full workspace unit tests: **PASS — 233 tests**.
- Workspace build: **PASS**.
- Secrets check: **PASS**.
- Documentation check: **PASS**.
- Docker Compose config validation: **PASS**.
- `git diff --check`: **PASS**.
- Final migration state: **PASS — 8/8 migrations applied**.

## Remaining Blockers / Blocker còn lại

- Cấu hình terminal/hash secret Sandbox ngoài Git.
- Cấu hình endpoint và đăng ký `VNPAY_IPN_URL` public HTTPS để VNPAY gọi server-to-server.
- Chạy browser checkout bằng Sandbox test payment data và xác minh IPN thật sau khi hai điều kiện trên sẵn sàng.
