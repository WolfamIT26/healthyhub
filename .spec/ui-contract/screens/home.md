# Home Screen / Màn hình trang chủ

## Screen Overview / Tổng quan màn hình

Trang chủ là cửa vào storefront, giúp guest/customer đi nhanh đến sản phẩm, danh mục, khuyến mãi, blog và AI hỗ trợ.

## Business Goal / Mục tiêu kinh doanh

Tăng khả năng khám phá sản phẩm healthy, đưa người dùng vào luồng mua hàng nhanh và tạo niềm tin ban đầu.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/` | Trang chủ public. |

## Permission / Phân quyền

Guest, customer, member, VIP, staff/admin đều có thể xem dữ liệu public.

## Required API / API bắt buộc

- `GET /api/v1/public/settings/storefront`.
- `GET /api/v1/public/products`.
- `GET /api/v1/public/categories/tree`.
- `GET /api/v1/public/promotions`.
- `GET /api/v1/public/blog-posts`.

## Required Data / Dữ liệu bắt buộc

Storefront settings, featured product list, category tree, active promotion summary, latest blog card và public media URLs.

## UI Sections / Khu vực UI

Header, search entry, featured products, category shortcut, promotion strip, blog preview, AI assistant entry, footer.

## Components / Thành phần

App Shell, Product Card, Category Shortcut, Promotion Banner, Blog Card, Search Input, AI Entry.

## Form / Form

Search box dẫn đến Product List với keyword.

## Validation / Validation

Keyword search trim, giới hạn độ dài và không gửi keyword rỗng nếu không cần.

## Search / Tìm kiếm

Search theo product keyword qua Product List.

## Filter / Lọc

Category shortcut truyền `categoryId` sang Product List.

## Sort / Sắp xếp

Featured products theo thứ tự API trả về.

## Pagination / Phân trang

Không phân trang trực tiếp trên Home; mỗi section chỉ lấy số item giới hạn.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton cho product card, category shortcut và blog card.

## Empty State / Trạng thái rỗng

Ẩn section không có dữ liệu và giữ luồng chính đến Product List.

## Error State / Trạng thái lỗi

Nếu section phụ lỗi, hiển thị warning nhẹ; nếu settings lỗi, dùng fallback cấu hình public an toàn.

## Success State / Trạng thái thành công

Dữ liệu public hiển thị đầy đủ và các link điều hướng hoạt động.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Chỉ dùng khi thêm nhanh sản phẩm vào giỏ nếu feature này được bật sau.

## Skeleton / Skeleton

Skeleton giữ kích thước vùng featured product, category và blog để không nhảy layout.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên search, category shortcut và product card; desktop có thể hiển thị nhiều cột hơn ở bước design sau.

## Accessibility / Khả năng tiếp cận

Search có label, product card có tên sản phẩm rõ, ảnh có alt text từ media contract.

## SEO Metadata / SEO metadata

Có title, description, canonical URL và structured data storefront nếu SEO prompt sau này triển khai.

