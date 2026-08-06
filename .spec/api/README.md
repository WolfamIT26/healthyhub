# API Specification Index / Mục lục đặc tả API

## Purpose / Mục tiêu

Thư mục `.spec/api` chứa API Specification cho HealthyHub dựa trên Data Contract Specification. Bộ tài liệu này là đầu vào cho OpenAPI, Backend, Frontend và Mobile ở các bước sau.

Prompt 10 chỉ tạo tài liệu API Specification. Không tạo OpenAPI, không tạo Swagger, không viết controller, service hoặc code.

## Reading Order / Thứ tự đọc

1. [API Conventions / Quy ước API](api-conventions.md).
2. [API Security / Bảo mật API](security.md).
3. [Authentication Flow / Luồng xác thực](authentication-flow.md).
4. [Error Catalog / Danh mục lỗi API](error-catalog.md).
5. [Domain API Map / Bản đồ API theo domain](domain-api-map.md).
6. [Endpoint Matrix / Ma trận endpoint](endpoint-matrix.md).
7. [Rate Limit Policy / Chính sách giới hạn gọi API](rate-limit-policy.md).
8. [Webhook Policy / Chính sách webhook](webhook-policy.md).
9. [Domain API Specifications / Đặc tả API theo domain](domains/README.md).

## Foundation References / Tài liệu nền

- [Foundation Documentation](../../docs/foundation/README.md).
- [AI Development Core](../../.ai/README.md).
- [Business Blueprint](../../docs/business-blueprint/README.md).
- [Feature Specifications](../features/README.md).
- [Domain Model](../domain/README.md).
- [Physical Database Design](../database-physical/README.md).
- [Data Contract Specification](../data-contracts/README.md).

## API Scope / Phạm vi API

API Specification bao phủ các nhóm:

- Public API cho khách xem sản phẩm, nội dung và thông tin công khai.
- Customer API cho tài khoản khách hàng, giỏ hàng, đơn hàng, wishlist, review và notification cá nhân.
- Admin API cho staff, manager, administrator và super admin.
- AI API cho chat, search, recommendation, compare, OCR, vision, nutrition, marketing và analytics.
- Webhook API dự kiến cho payment, shipping và notification provider.

## Output Rule / Quy tắc đầu ra

- Không tạo file OpenAPI hoặc Swagger trong Prompt 10.
- Không viết controller, service, repository, entity, DTO code hoặc validation code.
- Không tạo SQL, migration hoặc seed data.
- Endpoint trong tài liệu là đặc tả thiết kế, chưa phải implementation.

## Status Files / File trạng thái

- [Status](Status.md).
- [Report](Report.md).
- [Checklist](Checklist.md).
- [ChangeLog](ChangeLog.md).

