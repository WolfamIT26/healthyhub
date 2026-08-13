# Wishlist Report / Báo cáo Wishlist

Prompt 30 bổ sung `wishlists`/`wishlist_items`, TypeORM repository và four Customer API operations. Membership là server authority; current Product price/public state và Inventory availability được đọc tại request time.

Customer lock cộng DB uniqueness ngăn concurrent duplicate. Owner derive từ JWT/active CustomerProfile, foreign item không được lộ và response không chứa internal Wishlist/customer/audit metadata. Frontend provider keyed theo actor nên logout/account switch clear memory trong khi dữ liệu server được bảo toàn.
