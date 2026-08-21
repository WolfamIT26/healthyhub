# Inventory API Specification / Đặc tả API tồn kho

## API Overview / Tổng quan API

Inventory API quản lý tồn kho, khả năng bán, cảnh báo tồn kho, điều chỉnh tồn kho và lịch sử movement. Domain này chỉ dành cho staff/manager/admin, public chỉ nhận stock status gián tiếp qua Product API.

Prompt 32.1 không mở các Admin endpoints design-only bên dưới. Stock mutation là internal capability được gọi trong Order/verified Payment transactions; operation inventory vẫn 196.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/admin/inventory` | Danh sách tồn kho | Staff JWT | `inventory:read` |
| GET | `/api/v1/admin/inventory/{productId}` | Tồn kho theo sản phẩm | Staff JWT | `inventory:read` |
| POST | `/api/v1/admin/inventory/adjustments` | Điều chỉnh tồn kho | Manager/Admin JWT | `inventory:adjust` |
| GET | `/api/v1/admin/inventory/movements` | Lịch sử movement | Staff JWT | `inventory:read` |
| GET | `/api/v1/admin/inventory/alerts` | Cảnh báo tồn kho | Staff JWT | `inventory:read` |
| POST | `/api/v1/admin/inventory/exports` | Xuất báo cáo tồn kho | Manager/Admin JWT | `inventory:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `inventory`.
- Related resources: `adjustments`, `movements`, `alerts`, `exports`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail/movement/alert.
- POST cho adjustment và export job.

## URI Convention / Quy ước URI

- Admin namespace: `/api/v1/admin/inventory`.
- Product reference dùng `{productId}` khi xem tồn kho theo sản phẩm.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- `inventory:read` cho xem tồn kho.
- `inventory:adjust` cho điều chỉnh tồn kho.

## Authentication / Xác thực

- Bắt buộc Staff JWT trở lên.

## Authorization / Phân quyền

- Staff limited chỉ xem hoặc điều chỉnh trong phạm vi được giao.
- Điều chỉnh tồn kho phải có reason và audit.

## Request Contract / Contract request

- Inventory list dùng query input.
- Adjustment dùng action request, có productId, movement type, quantity, reason và idempotency key.
- Export dùng export contract.

## Response Contract / Contract response

- Inventory summary trả product summary, stock status, available quantity, reserved quantity và updatedAt.
- Movement summary trả type, quantity, reason, actor summary và timestamp.

## Error Contract / Contract lỗi

- `BUSINESS.INVENTORY.INSUFFICIENT_STOCK`
- `CONFLICT.INVENTORY.VERSION_CONFLICT`
- `VALIDATION.INVENTORY.INVALID_ADJUSTMENT`
- `NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND`

## Validation Rule / Quy tắc validation

- Quantity là số nguyên không âm trừ adjustment policy cho phép âm logic.
- Movement type thuộc enum hợp lệ.
- Reason bắt buộc với adjustment.
- Product phải tồn tại và thuộc scope.

## Business Rule / Quy tắc nghiệp vụ

- Không cho bán vượt tồn kho khả dụng.
- Movement không được sửa lịch sử sau khi ghi, chỉ tạo movement bù.
- Public stock status do Product API hiển thị, không lộ chi tiết tồn kho public.

## Pagination / Phân trang

- Inventory list default 20, max 100.
- Movement list default 50, max 200 hoặc cursor khi dữ liệu lớn.

## Filter / Lọc

- Lọc theo productId, stockStatus, movementType, createdAt, lowStock flag.

## Search / Tìm kiếm

- Search theo product name, product code.

## Sort / Sắp xếp

- Default sort: cảnh báo tồn kho trước, sau đó `updatedAt` desc.

## Upload / Upload

Import tồn kho từ file có thể bổ sung sau, hiện chưa là endpoint bắt buộc.

## Download / Download

Export tồn kho dùng export contract và Cost Strict rate limit.

## Rate Limit / Giới hạn gọi API

- Inventory read: Authenticated Normal.
- Adjustment/export: Strict hoặc Cost Strict.

## Idempotency / Chống gửi lặp

- Adjustment bắt buộc idempotency key để tránh cộng/trừ trùng.

## Webhook / Webhook

Không áp dụng trong Prompt 10.

## AI Endpoint / Endpoint AI

AI inventory insight thuộc AI/Analytics API, Inventory API chỉ cung cấp source dữ liệu theo quyền.

## Prompt 32.1 Executable Contract / Contract chạy Prompt 32.1

- Không thêm public Inventory endpoint; Product API chỉ trả `availability`/`sellable` và không trả quantity.
- Cart/Order gọi internal Inventory authority phía server, không nhận availability từ client; Order/verified Payment flow gọi internal stock mutation capability trong caller-owned transaction.
- Không dùng browser return làm stock authority và không thêm public operation.
- Các Admin Inventory endpoint ở trên vẫn là design contract, chưa executable trong Prompt 32.1. Exact adjustment payload/idempotency persistence và permission implementation cần prompt riêng; Admin Inventory UI bị loại khỏi scope.
