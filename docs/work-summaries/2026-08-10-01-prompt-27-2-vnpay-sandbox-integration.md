# Prompt 27.2 - HealthyHub VNPAY Sandbox Integration

## Task / Nhiệm vụ
Tích hợp VNPAY Sandbox thật vào HealthyHub theo official contract, giữ COD nguyên trạng và không dùng fake success.

## Summary / Tóm tắt
- Thêm VNPAY adapter phía sau payment gateway neutral.
- Backend tạo payment URL thật, ký hash đúng contract và xử lý browser return/IPN authoritative.
- Checkout web hỗ trợ COD + VNPAY từ response server.
- Thêm trang return/result cho payment và route tương ứng.
- Cập nhật OpenAPI, schema request, example và tài liệu tổng hợp.

## Added / Đã thêm
- `apps/api/src/gateways/payment/vnpay-payment.gateway.ts`
- `apps/api/src/gateways/payment/vnpay-payment.gateway.spec.ts`
- `apps/api/src/presentation/payment/payment.module.ts`
- `apps/api/src/presentation/payment/payment.service.ts`
- `apps/api/src/presentation/payment/payment.controller.ts`
- `apps/api/src/presentation/payment/payment.controller.spec.ts`
- `apps/api/src/presentation/payment/payment.dto.ts`
- `apps/api/src/presentation/payment/payment.exception.ts`
- `apps/api/src/database/migrations/1760000007000-enable-order-confirmation.ts`
- `apps/web/src/features/payment/paymentNavigation.ts`
- `apps/web/src/pages/PaymentReturnPage.tsx`
- `apps/web/src/pages/PaymentReturnPage.spec.tsx`
- `apps/web/src/pages/PaymentResultPage.tsx`
- `apps/web/src/pages/PaymentResultPage.spec.tsx`

## Updated / Đã cập nhật
- `apps/api/src/domain/payment/payment-provider.gateway.ts`
- `apps/api/src/domain/payment/payment-method.reader.ts`
- `apps/api/src/domain/payment/payment-foundation.module.ts`
- `apps/api/src/domain/payment/payment-provider.registry.ts`
- `apps/api/src/data/order/entities/order.entity.ts`
- `apps/api/src/data/order/repositories/order.repository.ts`
- `apps/api/src/presentation/order/order.dto.ts`
- `apps/api/src/presentation/order/order-creation.service.ts`
- `apps/api/src/presentation/order/order-creation.service.spec.ts`
- `apps/api/src/domain/payment/payment-method.reader.spec.ts`
- `apps/api/src/domain/payment/payment-provider.registry.spec.ts`
- `apps/web/src/features/payment/paymentApi.ts`
- `apps/web/src/features/payment/payment.types.ts`
- `apps/web/src/features/checkout/checkoutApi.ts`
- `apps/web/src/features/checkout/checkout.types.ts`
- `apps/web/src/pages/CheckoutPage.tsx`
- `apps/web/src/pages/CheckoutPage.spec.tsx`
- `apps/web/src/routes/AppRouter.tsx`
- `openapi/openapi.yaml`
- `openapi/schemas/common.yaml`
- `openapi/examples/common.yaml`
- `openapi/paths/domain-map.yaml`
- `openapi/README.md`
- `openapi/Status.md`
- `openapi/Report.md`
- `openapi/Checklist.md`
- `openapi/ChangeLog.md`
- `.spec/api/domains/payment.md`
- `docs/payment.md`
- `docs/checkout.md`
- `docs/order.md`
- `modules/payment/API.md`
- `modules/payment/Backend.md`
- `modules/payment/ChangeLog.md`
- `modules/payment/Checklist.md`
- `modules/payment/Decision.md`
- `modules/payment/Frontend.md`
- `modules/payment/Requirement.md`
- `modules/payment/Report.md`
- `modules/payment/Security.md`
- `modules/payment/Status.md`
- `modules/checkout/API.md`
- `modules/checkout/Backend.md`
- `modules/checkout/ChangeLog.md`
- `modules/checkout/Checklist.md`
- `modules/checkout/Decision.md`
- `modules/checkout/Frontend.md`
- `modules/checkout/Requirement.md`
- `modules/checkout/Report.md`
- `modules/checkout/Status.md`
- `modules/checkout/TODO.md`
- `modules/orders/Decision.md`
- `modules/orders/Report.md`
- `modules/orders/Testing.md`
- `CHANGELOG.md`
- `TONG_HOP_DA_LAM.md`
- `docs/work-summaries/README.md`

## Not Changed / Không đổi
- COD checkout flow cũ vẫn giữ.
- Không thêm production credential.
- Không thêm refund, admin settlement hoặc provider mới.
- Không đổi stack hoặc tạo business code ngoài payment/checkout boundary.

## Verification / Kiểm tra
- Full test suite: Passed.
- Typecheck toàn workspace: Passed.
- Build toàn workspace: Passed.
- Lint: Passed.
- OpenAPI validation: Passed (196 operation, 196 spec rows).
- Secrets check: Passed.
- Docs check: Passed.
- `git diff --check`: Passed.

## Notes / Ghi chú
- `VNPAY_RETURN_URL` vẫn cần developer cấp sandbox credential hợp lệ để E2E thật.
- Webhook/IPN trả raw JSON `{RspCode, Message}` để khớp provider contract.
- Sandbox E2E thật chưa chạy vì credentials không được cung cấp trong lượt này.
