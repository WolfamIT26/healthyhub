# Customer Domain / Domain khách hàng

## Purpose / Mục đích

Quản lý hồ sơ khách hàng, lịch sử tương tác mua hàng và dữ liệu chăm sóc khách ở mức nghiệp vụ.

## Responsibility / Trách nhiệm

- Quản lý thông tin hồ sơ khách.
- Phân nhóm khách hàng ở mức vận hành.
- Bảo vệ privacy và quyền truy cập dữ liệu khách.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `CustomerProfile`
- Entity: `CustomerAddress`, `CustomerSegment`, `SupportNote`
- Value Object: `ContactInfo`, `CustomerCode`, `ConsentState`
- Enum: `CustomerStatus`, `CustomerSegmentType`, `MarketingOptInStatus`

## Relationships / Quan hệ với domain khác

- Phụ thuộc User/Authentication để xác định chủ tài khoản.
- Order, Shipping, Loyalty và Review tham chiếu Customer.
- AI và Analytics chỉ dùng dữ liệu Customer theo policy.

## Business Rule / Quy tắc nghiệp vụ

- Customer chỉ xem dữ liệu của chính mình.
- Staff chỉ xem thông tin cần thiết cho vận hành.
- Dữ liệu khách không dùng cho marketing hoặc AI nếu chưa có policy phù hợp.

## Domain Event / Sự kiện domain

- `CustomerProfileCreated`
- `CustomerContactUpdated`
- `CustomerSegmentChanged`
- `MarketingOptInChanged`

## Dependency / Phụ thuộc

- Core dependency: User, Authentication
- Downstream: Order, Shipping, Loyalty, Review, AI, Analytics

## Boundary / Ranh giới

Customer không quản lý order lifecycle, điểm loyalty hoặc nội dung AI. Domain này sở hữu hồ sơ và consent của khách.

