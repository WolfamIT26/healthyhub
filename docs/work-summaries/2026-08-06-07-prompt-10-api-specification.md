# Prompt 10 - API Specification / Tổng hợp đặc tả API

## Task / Nhiệm vụ

Tạo API Specification cho HealthyHub dựa trên Data Contract Specification, Physical Database Design, Domain Model, Feature Specifications và Business Blueprint.

## Summary / Tóm tắt

Đã tạo bộ tài liệu `.spec/api` để thiết kế REST API trước khi sinh OpenAPI, Backend, Frontend hoặc Mobile. Bộ tài liệu bao gồm API convention, security, authentication flow, error catalog, domain API map, endpoint matrix, rate limit policy, webhook policy và 23 domain API specification.

## Added / Đã thêm

- `.spec/api/README.md`
- `.spec/api/api-conventions.md`
- `.spec/api/security.md`
- `.spec/api/authentication-flow.md`
- `.spec/api/error-catalog.md`
- `.spec/api/domain-api-map.md`
- `.spec/api/endpoint-matrix.md`
- `.spec/api/rate-limit-policy.md`
- `.spec/api/webhook-policy.md`
- `.spec/api/Status.md`
- `.spec/api/Report.md`
- `.spec/api/Checklist.md`
- `.spec/api/ChangeLog.md`
- `.spec/api/domains/README.md`
- `.spec/api/domains/authentication.md`
- `.spec/api/domains/user.md`
- `.spec/api/domains/customer.md`
- `.spec/api/domains/staff.md`
- `.spec/api/domains/product.md`
- `.spec/api/domains/category.md`
- `.spec/api/domains/brand.md`
- `.spec/api/domains/inventory.md`
- `.spec/api/domains/cart.md`
- `.spec/api/domains/wishlist.md`
- `.spec/api/domains/order.md`
- `.spec/api/domains/payment.md`
- `.spec/api/domains/shipping.md`
- `.spec/api/domains/coupon.md`
- `.spec/api/domains/promotion.md`
- `.spec/api/domains/loyalty.md`
- `.spec/api/domains/review.md`
- `.spec/api/domains/blog.md`
- `.spec/api/domains/media.md`
- `.spec/api/domains/notification.md`
- `.spec/api/domains/analytics.md`
- `.spec/api/domains/ai.md`
- `.spec/api/domains/settings.md`

## Updated / Đã cập nhật

- `README.md`
- `.spec/README.md`
- `docs/README.md`
- `docs/01-folder-structure.md`
- `docs/05-api.md`
- `docs/api/README.md`
- `CAU_TRUC_THU_MUC.md`
- `TONG_HOP_DA_LAM.md`
- `CHANGELOG.md`
- `docs/18-framework-inventory.md`
- `docs/work-summaries/README.md`

## Not Changed / Không thay đổi

- Không tạo OpenAPI.
- Không tạo Swagger.
- Không viết Backend controller/service/repository.
- Không viết Frontend.
- Không viết DTO code hoặc entity.
- Không viết SQL hoặc migration.
- Không thay đổi technology stack.

## Verification / Kiểm tra

- Kiểm tra `.spec/api` chỉ có Markdown.
- Kiểm tra đủ 23 domain API specification.
- Kiểm tra domain file có các section bắt buộc của Prompt 10.
- Kiểm tra không tạo OpenAPI/Swagger mới.
- Kiểm tra Markdown bằng `git diff --check`.

## Notes / Ghi chú

Prompt OpenAPI sau này nên đọc `.spec/api/README.md`, `.spec/api/api-conventions.md`, `.spec/api/error-catalog.md` và từng file `.spec/api/domains` để sinh OpenAPI đúng theo API Specification.

