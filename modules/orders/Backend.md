# Order Backend / Backend module đơn hàng

## Services / Service

`CustomerOrderService` resolve owner, validate date range, map aggregate persisted thành Customer-safe list/detail read model và trả not-found đồng nhất.

## Repositories / Repository

`TypeOrmOrderRepository` bổ sung owner-scoped page/detail query. Page join Payment/Shipment để filter canonical status, giới hạn 100 item và load related records theo batch; detail load toàn snapshot với tenant constraint.

## Presentation / Presentation

`CustomerOrderController` ở `/me/orders`, dùng `AccessTokenGuard`, `RolesGuard` và `CUSTOMER` role. Paginated response đưa metadata vào envelope chuẩn.

Không có gateway call, mutation hoặc provider verification trong read flow.

## Fulfillment application boundary / Ranh giới ứng dụng fulfillment

`OrderFulfillmentService` chỉ nhận command nội bộ với transition type, Order ID, occurredAt, reason và optional actor. Repository lock Order rồi Shipment, kiểm tra separate state machines và Payment readiness, sau đó persist snapshots, timestamps, history và Inventory effect trong một transaction.

- COD: `new/pending` vẫn được ship/deliver.
- VNPAY: ship/deliver chỉ khi Payment `paid` và Order `confirmed` từ verified IPN.
- Delivery: Shipment `shipped → delivered`, Order `new|confirmed → completed`.
- Cancel: chỉ Shipment `pending`, Order `new|confirmed`; restore active/consumed reservation.
- Return: chỉ Shipment `delivered`, Order `completed`; full-order restock.

Desired state đã đạt trả `idempotent`; row lock serialize concurrent calls. Payment service tiếp tục sở hữu `new → confirmed` và ghi Order history trong provider-event transaction.
