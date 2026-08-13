# Order Backend / Backend module đơn hàng

## Services / Service

`CustomerOrderService` resolve owner, validate date range, map aggregate persisted thành Customer-safe list/detail read model và trả not-found đồng nhất.

## Repositories / Repository

`TypeOrmOrderRepository` bổ sung owner-scoped page/detail query. Page join Payment/Shipment để filter canonical status, giới hạn 100 item và load related records theo batch; detail load toàn snapshot với tenant constraint.

## Presentation / Presentation

`CustomerOrderController` ở `/me/orders`, dùng `AccessTokenGuard`, `RolesGuard` và `CUSTOMER` role. Paginated response đưa metadata vào envelope chuẩn.

Không có gateway call, mutation hoặc provider verification trong read flow.
