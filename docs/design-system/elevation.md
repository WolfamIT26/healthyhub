# Elevation / Cấp nổi

## Purpose / Mục tiêu

Elevation mô tả độ ưu tiên của surface trong giao diện. Tài liệu này chỉ định nghĩa cấp nổi logic, không viết hiệu ứng.

## Elevation Scale / Thang cấp nổi

| Token / Token | Level / Cấp | Usage / Cách dùng |
| --- | --- | --- |
| `elevation.0` | Base | Page background, section thường. |
| `elevation.1` | Raised | Card, product card, admin panel. |
| `elevation.2` | Overlay | Dropdown, popover, tooltip. |
| `elevation.3` | Focused Overlay | Drawer, sticky action bar. |
| `elevation.4` | Modal | Modal, confirmation dialog. |
| `elevation.5` | Critical | Toast stack, blocking alert. |

## Usage Rule / Quy tắc sử dụng

- Storefront dùng elevation thấp để sản phẩm nổi vừa đủ.
- Admin không dùng quá nhiều surface nổi; table và drawer là trọng tâm.
- Modal xác nhận hành động nguy hiểm luôn cao hơn drawer/list.
- Toast không che CTA chính hoặc thông tin checkout quan trọng.

