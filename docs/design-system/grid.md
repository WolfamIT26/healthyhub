# Grid / Lưới layout

## Purpose / Mục tiêu

Grid định nghĩa cách chia layout cho storefront, checkout, account và admin. Đây là contract thiết kế, chưa phải implementation.

## Container Rule / Quy tắc container

| Area / Khu vực | Container / Khung nội dung | Rule / Quy tắc |
| --- | --- | --- |
| Storefront | Centered content | Giữ nội dung dễ đọc, ảnh sản phẩm đủ lớn. |
| Product List | Product grid + filter area | Filter không che danh sách, mobile chuyển thành drawer/filter sheet ở prompt sau. |
| Product Detail | Media + information | Mobile ưu tiên ảnh, tên, giá, CTA và thông tin chính. |
| Checkout | Step/form + summary | Desktop có summary bên cạnh; mobile summary có thể thu gọn. |
| Admin | Sidebar + content | Desktop ưu tiên table rộng; mobile chuyển sang compact list nếu cần. |
| Analytics | Dashboard grid | KPI, chart và filter ngày phải ổn định khi dữ liệu thay đổi. |

## Column Rule / Quy tắc cột

- Mobile dùng một cột cho nội dung chính.
- Tablet có thể dùng hai cột cho product/account nếu đủ không gian.
- Desktop storefront có thể dùng product grid nhiều cột.
- Admin desktop ưu tiên table full-width, không chia nhỏ quá nhiều card.

## Density Rule / Quy tắc mật độ

- Storefront: thoáng, dễ nhìn ảnh và giá.
- Checkout: rõ từng bước, giảm phân tâm.
- Admin: mật độ cao hơn, nhưng action nguy hiểm vẫn cần vùng riêng và xác nhận.

