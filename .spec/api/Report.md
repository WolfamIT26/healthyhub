# API Specification Report / Báo cáo API Specification

## Purpose / Mục tiêu

Báo cáo này tổng hợp kết quả Prompt 10: Generate API Specification.

## Summary / Tóm tắt

Đã tạo bộ API Specification tại `.spec/api` dựa trên Data Contract Specification, Domain Model, Physical Database Design và Business Blueprint.

Bộ tài liệu bao phủ:

- API convention.
- Security rule.
- Authentication flow.
- Error catalog.
- Domain API map.
- Endpoint matrix.
- Rate limit policy.
- Webhook policy.
- 23 API specification theo domain.

## Design Decisions / Quyết định thiết kế

| Decision / Quyết định | Reason / Lý do |
| --- | --- |
| Base URI dùng `/api/v1` | Rõ version và sẵn sàng nâng cấp `/api/v2`. |
| Tách namespace public, me, admin, ai và webhooks | Giúp phân quyền rõ và dễ mở rộng mobile/SaaS. |
| Response dùng envelope Data Contract | Giữ frontend/mobile/AI client xử lý thống nhất. |
| Permission dùng pattern `<domain>:<action>` | Dễ mapping role và permission matrix. |
| API docs chỉ ở Markdown | Đúng yêu cầu Prompt 10, chưa tạo OpenAPI/Swagger. |

## Boundary / Ranh giới

Prompt 10 chỉ tạo tài liệu API Specification. Endpoint trong tài liệu chưa phải implementation và chưa sinh OpenAPI.

## Assumptions / Giả định

- HealthyHub dùng `/api/v1` cho API version đầu.
- Public product detail có thể dùng `{productId}` ở spec hiện tại; slug/public identifier có thể bổ sung ở API refinement sau.
- Payment, shipping và notification provider thật chưa chọn, nên webhook chỉ thiết kế pattern provider-neutral.

