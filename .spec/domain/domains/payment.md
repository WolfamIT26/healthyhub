# Payment Domain / Domain thanh toán

## Purpose / Mục đích

Quản lý phương thức, trạng thái và điều chỉnh thanh toán ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Theo dõi trạng thái thanh toán của order.
- Bảo vệ rule không xử lý sai đơn chưa đủ điều kiện thanh toán.
- Chuẩn bị boundary cho Payment Gateway sau này.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Payment`
- Entity: `PaymentAttempt`, `RefundRequest`, `PaymentStatusHistory`
- Value Object: `PaymentMethod`, `PaymentAmount`, `RefundReason`
- Enum: `PaymentStatus`, `PaymentMethodType`, `RefundStatus`

## Relationships / Quan hệ với domain khác

- Payment thuộc về Order.
- Settings quyết định phương thức/chính sách thanh toán.
- Analytics đọc payment status để báo cáo.

## Business Rule / Quy tắc nghiệp vụ

- Order phải có payment status rõ.
- Không đánh dấu đã thanh toán nếu chưa đủ điều kiện.
- Refund/adjustment cần quyền phù hợp và lý do.
- Online payment tương lai phải qua Payment Gateway.

## Domain Event / Sự kiện domain

- `PaymentInitialized`
- `PaymentConfirmed`
- `PaymentFailed`
- `RefundRequested`
- `RefundCompleted`

## Dependency / Phụ thuộc

- Core dependency: Order, Settings
- Gateway dependency future: Payment Gateway

## Boundary / Ranh giới

Payment không quản lý thông tin thẻ/credential nhạy cảm. Domain chỉ quản lý trạng thái và rule nghiệp vụ thanh toán.

