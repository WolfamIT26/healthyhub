# Shadow / Đổ bóng

## Purpose / Mục tiêu

Shadow hỗ trợ nhận biết lớp giao diện. Shadow không được dùng như trang trí chính và phải nhẹ để giữ cảm giác sạch.

## Shadow Scale / Thang đổ bóng

| Token / Token | Visual Intent / Ý định thị giác | Usage / Cách dùng |
| --- | --- | --- |
| `shadow.none` | Không bóng. | Table, section phẳng, admin dense area. |
| `shadow.sm` | Tách nhẹ khỏi nền. | Product card, small card, dropdown nhỏ. |
| `shadow.md` | Surface nổi rõ. | Drawer, popover, sticky bar. |
| `shadow.lg` | Tập trung chú ý. | Modal, confirmation dialog. |
| `shadow.focus` | Trạng thái focus. | Input, button, select đang focus. |

## Usage Rule / Quy tắc sử dụng

- Shadow phải đi cùng elevation, không tự ý dùng riêng.
- Không dùng shadow nặng cho mọi card.
- Dark mode giảm độ sáng shadow và tăng phân tách bằng border/surface.
- Focus shadow phải đủ rõ cho keyboard navigation.

