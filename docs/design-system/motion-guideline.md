# Motion Guideline / Quy tắc chuyển động

## Purpose / Mục tiêu

Motion giúp phản hồi thao tác và chuyển trạng thái rõ hơn. Motion không dùng để trang trí quá mức hoặc làm chậm luồng mua hàng/admin.

## Motion Tokens / Token chuyển động

| Token / Token | Duration / Thời lượng | Usage / Cách dùng |
| --- | --- | --- |
| `motion.instant` | 0 đến 80ms | Trạng thái control nhỏ, hover/focus nhẹ. |
| `motion.fast` | 120 đến 180ms | Toast, dropdown, tab, filter panel. |
| `motion.normal` | 200 đến 300ms | Modal, drawer, page section transition nhẹ. |
| `motion.slow` | 350 đến 500ms | Chỉ dùng cho chuyển cảnh ít gặp, không dùng cho checkout/admin action. |

## Usage Rule / Quy tắc sử dụng

- Loading phải cho biết hệ thống đang xử lý, không gây giật layout.
- Skeleton ưu tiên ổn định kích thước thay vì hiệu ứng nổi bật.
- Modal/drawer nên có motion ngắn và dễ dự đoán.
- AI response có thể hiển thị trạng thái đang xử lý nhưng không kéo dài vô nghĩa.
- Tôn trọng reduce motion ở phase frontend.

## Avoid / Tránh

- Animation trang trí trong admin dashboard.
- Motion làm người dùng khó bấm checkout hoặc action vận hành.
- Chuyển động liên tục quanh card sản phẩm.
- Hiệu ứng gây hiểu nhầm rằng payment/order đã hoàn tất khi chưa có response.

