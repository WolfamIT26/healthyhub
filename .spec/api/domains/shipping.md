# Shipping API Specification / Đặc tả API giao hàng

## API Overview / Tổng quan API

Shipping API quản lý shipping quote, shipment, tracking và webhook đơn vị vận chuyển tương lai. Address và phone cần masking theo quyền.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/shipping/quotes` | Tính phí/ước lượng giao hàng | Public hoặc Customer JWT | Public/owner |
| GET | `/api/v1/shipping/shipments/{shipmentId}/tracking` | Xem tracking cho khách | Customer JWT hoặc tracking proof | Owner/proof |
| GET | `/api/v1/admin/shipments` | Danh sách shipment admin | Staff JWT | `shipping:read` |
| GET | `/api/v1/admin/shipments/{shipmentId}` | Chi tiết shipment admin | Staff JWT | `shipping:read` |
| PATCH | `/api/v1/admin/shipments/{shipmentId}/status` | Cập nhật trạng thái giao hàng | Staff/Manager JWT | `shipping:manage` |
| POST | `/api/v1/admin/shipments/{shipmentId}/tracking-events` | Thêm tracking event thủ công | Staff/Manager JWT | `shipping:manage` |
| POST | `/api/v1/webhooks/shipping/{provider}` | Nhận webhook vận chuyển | Provider auth | Provider scope |

## REST Resource / Tài nguyên REST

- Primary resources: `shipping`, `shipments`, `tracking-events`.
- Action resources: `quotes`, `tracking`, `status`.

## HTTP Method / Phương thức HTTP

- POST cho quote, tracking event và webhook.
- GET cho tracking/list/detail.
- PATCH cho status.

## URI Convention / Quy ước URI

- Customer/shared namespace: `/api/v1/shipping`.
- Admin namespace: `/api/v1/admin/shipments`.
- Webhook namespace: `/api/v1/webhooks/shipping/{provider}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public quote có thể cho guest nếu không lộ dữ liệu nhạy cảm.
- Staff đọc shipment.
- Manager/Admin cập nhật trạng thái.

## Authentication / Xác thực

- Quote public hoặc Customer JWT tùy flow.
- Tracking cần owner hoặc tracking proof.
- Admin bắt buộc Staff JWT.
- Webhook dùng provider auth.

## Authorization / Phân quyền

- Customer chỉ xem shipment của order mình.
- Admin theo scope vận hành.
- Address/phone masking nếu actor không đủ quyền.

## Request Contract / Contract request

- Quote request có destination summary và cart/order context nếu có.
- Status update cần action reason.
- Webhook event cần provider event ID để idempotency.

## Response Contract / Contract response

- Shipping quote summary.
- Shipping/tracking summary.
- Admin detail trả address snapshot theo quyền.

## Error Contract / Contract lỗi

- `BUSINESS.SHIPPING.INVALID_ADDRESS`
- `INTEGRATION.SHIPPING.PROVIDER_ERROR`
- `BUSINESS.SHIPPING.INVALID_STATUS`
- `NOT_FOUND.COMMON.RESOURCE_NOT_FOUND`

## Validation Rule / Quy tắc validation

- Address required fields.
- Status transition hợp lệ.
- Provider event ID hợp lệ với webhook.

## Business Rule / Quy tắc nghiệp vụ

- Shipping status phải đồng bộ với order lifecycle nhưng Shipping là domain sở hữu shipment.
- Tracking event không được sửa lịch sử nếu không có audit.

## Pagination / Phân trang

- Admin shipment list default 20, max 100.

## Filter / Lọc

- Lọc theo shippingStatus, carrier/provider, createdAt, deliveredAt.

## Search / Tìm kiếm

- Search theo order code, tracking reference, recipient phone masked.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Không áp dụng.

## Download / Download

Export shipment report nếu có dùng export contract.

## Rate Limit / Giới hạn gọi API

- Quote/status: Strict.
- Admin list/detail: Authenticated Normal.
- Webhook: Provider Strict.

## Idempotency / Chống gửi lặp

- Quote có thể idempotent theo cart/order context.
- Status update và webhook phải idempotent.

## Webhook / Webhook

- URI pattern: `/api/v1/webhooks/shipping/{provider}`.
- Webhook cập nhật tracking và shipping status sau khi verify provider.

## AI Endpoint / Endpoint AI

Không áp dụng trực tiếp. AI customer support có thể dùng tracking summary qua AI API theo quyền.

