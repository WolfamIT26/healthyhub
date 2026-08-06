# Enum Contract / Chuẩn enum

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa cách định nghĩa enum trong Data Contract để tránh đổi nghĩa trạng thái giữa database, backend, frontend, mobile và AI.

## Enum Principle / Nguyên tắc enum

- Enum value dùng `lower_snake_case`.
- Enum field dùng `camelCase`.
- Không dùng MySQL native enum làm nguồn truth cho contract.
- Không đổi nghĩa enum đã phát hành.
- Label tiếng Việt hiển thị ở UI, không gắn cứng vào enum value.

## Enum Lifecycle / Vòng đời enum

| Action / Hành động | Rule / Quy tắc |
| --- | --- |
| Add value | Được xem là compatible nếu client có fallback cho unknown value. |
| Rename value | Breaking change, cần version mới. |
| Remove value | Breaking change, cần deprecation trước. |
| Change meaning | Breaking change, không làm âm thầm. |
| Display label change | Không breaking nếu value không đổi. |

## Common Status Enum / Enum trạng thái dùng chung

| Enum / Enum | Values / Giá trị đề xuất | Usage / Cách dùng |
| --- | --- | --- |
| `recordStatus` | active, inactive, archived | Resource quản trị đơn giản. |
| `visibility` | public, private, internal, hidden | Media, content, product visibility. |
| `approvalStatus` | draft, pending_review, approved, rejected | Review, content, marketing output. |
| `jobStatus` | pending, validating, processing, completed, failed, cancelled, expired | Import/export/AI async job. |

## Domain Enum Catalog / Danh mục enum theo domain

| Domain / Domain | Enum Field / Field enum | Values / Giá trị đề xuất |
| --- | --- | --- |
| Authentication | `authStatus` | active, locked, disabled, pending_verification |
| User | `userStatus` | active, inactive, locked, deleted |
| Customer | `customerTier` | guest, member, vip |
| Staff | `staffStatus` | active, inactive, suspended |
| Product | `productStatus` | draft, active, inactive, archived |
| Product | `stockStatus` | in_stock, low_stock, out_of_stock, unavailable |
| Category | `categoryStatus` | active, inactive, archived |
| Brand | `brandStatus` | active, inactive, archived |
| Inventory | `inventoryMovementType` | import, export, adjustment, reservation, release |
| Cart | `cartStatus` | active, converted, abandoned, expired |
| Wishlist | `wishlistStatus` | active, archived |
| Order | `orderStatus` | draft, placed, confirmed, processing, shipped, completed, cancelled, refunded |
| Payment | `paymentStatus` | unpaid, pending, paid, failed, refunded, partially_refunded, cancelled |
| Shipping | `shippingStatus` | pending, preparing, shipped, delivered, failed, returned, cancelled |
| Coupon | `couponStatus` | draft, active, paused, expired, archived |
| Promotion | `promotionStatus` | draft, scheduled, active, paused, ended, archived |
| Loyalty | `loyaltyPointStatus` | pending, available, used, expired, reversed |
| Review | `reviewStatus` | pending, approved, rejected, hidden |
| Blog | `postStatus` | draft, scheduled, published, archived |
| Media | `mediaStatus` | uploaded, processing, active, failed, archived, deleted |
| Notification | `notificationStatus` | pending, sent, delivered, failed, read, cancelled |
| Analytics | `metricPeriod` | daily, weekly, monthly, quarterly, yearly |
| AI | `aiInteractionStatus` | pending, processing, completed, failed, blocked, requires_review |
| Settings | `settingScope` | system, tenant, user, feature |

## Unknown Enum Handling / Xử lý enum chưa biết

- Frontend/mobile phải có fallback hiển thị khi gặp enum mới.
- Backend không nhận enum ngoài danh sách cho request trừ khi field được khai báo mở rộng.
- AI không được tự bịa enum mới trong output có cấu trúc.
- Documentation phải cập nhật enum contract trước khi API dùng enum mới.

## Enum Display Rule / Quy tắc hiển thị enum

- UI dùng mapping label tiếng Việt riêng.
- Contract không phụ thuộc vào label hiển thị.
- Analytics nên lưu enum value ổn định, không lưu label.
- Export file có thể hiển thị cả enum value và label nếu cần cho người vận hành.

