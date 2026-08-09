# HealthyHub Search & Product Discovery V1

## Phạm vi

`ProductSearch` là search presentation dùng chung tại Homepage, public header/mobile menu và Product Catalog. Mọi truy vấn đều điều hướng về `/products?search=...`; suggestion sản phẩm mở `/products/:slug`, còn danh mục, thương hiệu và đặc điểm sản phẩm dùng URL filter tương ứng.

Search dùng dữ liệu Product typed hiện có, không gọi backend và không dùng AI runtime. Từ khóa được trim, gộp khoảng trắng, giới hạn 100 ký tự, so khớp không phân biệt hoa/thường và giữ nguyên Unicode/dấu tiếng Việt. Các field được tìm gồm tên, danh mục, thương hiệu, mô tả ngắn và dietary tag.

## Autocomplete và bàn phím

- Tối đa 8 suggestion, gồm text query, sản phẩm, danh mục, thương hiệu hoặc dietary tag.
- Focus khi chưa nhập hiển thị nhóm khám phá lấy từ catalog; đây không được gọi là dữ liệu “phổ biến”.
- Hỗ trợ `ArrowDown`, `ArrowUp`, `Enter`, `Escape`, `Tab` theo combobox/listbox semantics và active descendant.
- Catalog giữ filter hiện có khi submit search mới, reset page về 1 và đồng bộ URL. Clear search không xóa các filter khác; “Xóa tất cả” mới reset toàn bộ.

## Privacy decision

Không lưu recent search vào `localStorage`, `sessionStorage`, cookie hoặc backend. UI Contract hiện hành quy định form search/filter không lưu dữ liệu; query người dùng cũng có thể chứa thông tin nhạy cảm. Browser history chỉ phản ánh URL navigation bình thường và không có history UI riêng trong V1.

## Empty/error behavior

Search rỗng trên Homepage hiển thị lỗi an toàn. Catalog không có kết quả hiển thị EmptyState với lựa chọn xóa filter hoặc xem tất cả sản phẩm. Không log query và không giả lập kết quả từ API/AI.

## Trạng thái

**Complete — Visual Browser Verification Blocked**

Automated tests, lint, typecheck và build được ghi trong work summary. Kiểm tra visual trên browser bị chặn do local approval session đã bị thu hồi; đây không được coi là automated failure và không được tuyên bố visual pass.
