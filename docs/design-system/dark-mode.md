# Dark Mode / Chế độ tối

## Purpose / Mục tiêu

Dark Mode cần hỗ trợ đọc lâu, admin vận hành và trải nghiệm mua hàng trong môi trường thiếu sáng. Dark Mode là mapping semantic token, không phải đảo màu tự động.

## Dark Mode Principles / Nguyên tắc dark mode

- Dùng semantic token để đổi màu theo ngữ cảnh.
- Không đảo màu ảnh sản phẩm, logo hoặc media.
- Không làm mất phân biệt giữa success, warning, danger và AI assistive.
- Không dùng nền tối thuần nếu làm text và card quá gắt.
- Admin table phải giữ grid line và hover/focus rõ.

## Semantic Mapping / Mapping ngữ nghĩa

| Token / Token | Dark Value / Giá trị dark | Usage / Cách dùng |
| --- | --- | --- |
| `semantic.background.page` | `#111827` | Nền trang tối. |
| `semantic.background.surface` | `#1F2933` | Card, table, modal. |
| `semantic.background.subtle` | `#273444` | Section phụ, hover row. |
| `semantic.text.primary` | `#F9FAFB` | Text chính. |
| `semantic.text.secondary` | `#CBD5E1` | Text phụ. |
| `semantic.border.default` | `#3B4756` | Viền mặc định. |
| `semantic.action.primary` | `#5BBE6B` | CTA chính trong dark mode. |
| `semantic.status.warning` | `#F8C14A` | Warning rõ trên nền tối. |
| `semantic.status.danger` | `#FF6B5E` | Error/destructive. |
| `semantic.ai.assistive` | `#9B8CFF` | AI assistive. |

## Component Rule / Quy tắc component

- Product image giữ màu gốc và cần nền/surface phù hợp.
- Skeleton trong dark mode phải nhẹ, không nhấp nháy mạnh.
- Toast và modal phải có viền hoặc shadow đủ tách lớp.
- Chart cần palette dark riêng để đọc được line/bar và legend.
- AI output cần giữ source/confidence dễ nhận biết.

