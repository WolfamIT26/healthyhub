# Product List Screen / Màn hình danh sách sản phẩm

## Screen Overview / Tổng quan màn hình

Màn hình danh sách sản phẩm cho phép người dùng xem, tìm kiếm, lọc và sắp xếp sản phẩm public.

## Business Goal / Mục tiêu kinh doanh

Giúp khách tìm sản phẩm phù hợp nhanh, tăng khả năng vào Product Detail và thêm vào giỏ.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/products` | Danh sách sản phẩm public. |

## Permission / Phân quyền

Public. Customer đăng nhập có thể nhận dữ liệu cá nhân hóa nếu API hỗ trợ sau này.

## Required API / API bắt buộc

- `GET /api/v1/public/products`.
- `GET /api/v1/public/categories/tree`.
- `GET /api/v1/public/brands`.
- `POST /api/v1/ai/search/products` nếu dùng AI Search.

## Required Data / Dữ liệu bắt buộc

Product list items, pagination metadata, category tree, brand list, applied filter/search/sort metadata.

## UI Sections / Khu vực UI

Header search, filter panel, sort control, product grid/list, pagination, AI search entry.

## Components / Thành phần

Search Input, Filter Bar, Sort Control, Product Card, Pagination, Empty State, AI Entry.

## Form / Form

Search/filter form không lưu dữ liệu, đồng bộ với query route.

## Validation / Validation

Keyword trim, page/pageSize hợp lệ, filter field phải thuộc whitelist API.

## Search / Tìm kiếm

Search qua `q`; AI Search là action riêng khi user chọn tìm nâng cao.

## Filter / Lọc

Lọc theo categoryId, brandId, price, stockStatus và productStatus public-safe.

## Sort / Sắp xếp

Sort theo whitelist như price, name, updatedAt nếu API cho phép.

## Pagination / Phân trang

Page pagination default 20, max 60 theo Product API.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Giữ filter hiện tại, skeleton product grid và disabled pagination khi đang tải.

## Empty State / Trạng thái rỗng

Nếu không có kết quả, hiển thị lý do theo search/filter và gợi ý xóa filter.

## Error State / Trạng thái lỗi

Hiển thị lỗi list, cho phép retry; lỗi AI Search hiển thị riêng không làm hỏng search thường.

## Success State / Trạng thái thành công

Product grid cập nhật, pagination và applied filter hiển thị đúng.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng.

## Toast Message / Toast

Thêm vào giỏ thành công hoặc lỗi item unavailable nếu có add-to-cart quick action.

## Skeleton / Skeleton

Product card skeleton giữ ảnh, tên, giá và action area.

## Responsive Behavior / Hành vi responsive

Mobile dùng filter drawer hoặc collapsible filter; desktop hiển thị filter song song với grid ở bước design sau.

## Accessibility / Khả năng tiếp cận

Filter có label rõ, sort control đọc được bằng keyboard, product card có alt text và trạng thái hết hàng không chỉ dựa vào màu.

## SEO Metadata / SEO metadata

Title/description theo danh mục hoặc search; canonical cho `/products`; pagination SEO sẽ quyết định ở SEO prompt sau.

