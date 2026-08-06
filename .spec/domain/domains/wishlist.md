# Wishlist Domain / Domain yêu thích

## Purpose / Mục đích

Quản lý danh sách sản phẩm khách lưu để xem hoặc mua sau.

## Responsibility / Trách nhiệm

- Lưu/xóa sản phẩm yêu thích.
- Bảo vệ quyền riêng tư wishlist.
- Cung cấp tín hiệu hợp lệ cho recommendation khi có policy.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Wishlist`
- Entity: `WishlistItem`
- Value Object: `WishlistOwner`, `SavedProductReference`
- Enum: `WishlistItemStatus`, `WishlistVisibility`

## Relationships / Quan hệ với domain khác

- Phụ thuộc Customer và Product.
- AI Recommendation có thể dùng Wishlist làm tín hiệu nếu được phép.

## Business Rule / Quy tắc nghiệp vụ

- Chỉ Customer đã đăng nhập có wishlist cá nhân.
- Không lưu trùng cùng một sản phẩm.
- Wishlist không public mặc định.
- Product bị ẩn/hết hàng phải hiển thị trạng thái phù hợp.

## Domain Event / Sự kiện domain

- `ProductSavedToWishlist`
- `ProductRemovedFromWishlist`

## Dependency / Phụ thuộc

- Core dependency: Customer, Product
- Downstream: AI

## Boundary / Ranh giới

Wishlist không tạo cart hoặc order tự động; chỉ lưu ý định quan tâm của khách.

