# Color Palette / Bảng màu

## Purpose / Mục tiêu

Bảng màu của HealthyHub cần gợi cảm giác sạch, tin cậy và hiện đại, đồng thời đủ rõ cho thương mại điện tử và màn hình admin. Màu xanh là màu nhận diện chính nhưng không được biến toàn bộ giao diện thành một tông xanh đơn điệu.

## Foundation Palette / Bảng màu nền tảng

| Color / Màu | Token / Token | Value / Giá trị | Usage / Cách dùng |
| --- | --- | --- | --- |
| Leaf Green | `foundation.color.green.600` | `#2E7D32` | Primary action, trạng thái active, điểm nhấn healthy. |
| Fresh Mint | `foundation.color.mint.500` | `#20A67A` | Secondary action, AI assistive nhẹ, icon tích cực. |
| Citrus | `foundation.color.citrus.500` | `#F5A623` | Khuyến mãi, điểm nhấn thương mại, cảnh báo nhẹ. |
| Berry | `foundation.color.berry.500` | `#D94F70` | Wishlist, review highlight, accent hạn chế. |
| Sky Blue | `foundation.color.blue.500` | `#2F80ED` | Link, thông tin, trạng thái hệ thống. |
| Charcoal | `foundation.color.neutral.900` | `#1F2933` | Text chính light mode. |
| Slate | `foundation.color.neutral.700` | `#4B5563` | Text phụ, icon phụ. |
| Mist | `foundation.color.neutral.100` | `#F3F6F4` | Nền phụ, surface nhẹ. |
| White | `foundation.color.neutral.0` | `#FFFFFF` | Surface chính. |
| Red | `foundation.color.red.600` | `#D92D20` | Error, destructive action. |

## Semantic Palette / Bảng màu ngữ nghĩa

| Token / Token | Light Value / Giá trị light | Usage / Cách dùng |
| --- | --- | --- |
| `semantic.background.page` | `#FAFBFA` | Nền trang storefront và account. |
| `semantic.background.surface` | `#FFFFFF` | Card, modal, drawer, table surface. |
| `semantic.background.subtle` | `#F3F6F4` | Section phụ, skeleton base, filter area. |
| `semantic.text.primary` | `#1F2933` | Heading, body chính. |
| `semantic.text.secondary` | `#64748B` | Metadata, helper text. |
| `semantic.text.inverse` | `#FFFFFF` | Text trên nền tối hoặc primary action. |
| `semantic.border.default` | `#D8E0DC` | Viền input, table, divider. |
| `semantic.border.strong` | `#A7B4AF` | Viền focus hoặc surface quan trọng. |
| `semantic.action.primary` | `#2E7D32` | CTA chính. |
| `semantic.action.secondary` | `#20A67A` | CTA phụ. |
| `semantic.action.link` | `#2F80ED` | Link điều hướng. |
| `semantic.status.success` | `#2E7D32` | Thành công, còn hàng, active. |
| `semantic.status.warning` | `#F5A623` | Sắp hết hàng, cần chú ý. |
| `semantic.status.danger` | `#D92D20` | Lỗi, hủy, xóa, khóa. |
| `semantic.ai.assistive` | `#6C5CE7` | AI insight, AI chat, recommendation. |

## Contrast Rule / Quy tắc tương phản

- Text chính trên nền page/surface phải dễ đọc ở mobile.
- Trạng thái lỗi, cảnh báo và thành công không chỉ dựa vào màu; luôn có label hoặc icon.
- CTA chính phải có tương phản cao với text.
- Không dùng text màu nhạt trên ảnh sản phẩm nếu chưa có lớp bảo vệ tương phản ở bước visual design.

## Usage Rule / Quy tắc sử dụng

- Primary action dùng xanh lá; promotion dùng citrus; wishlist/review có thể dùng berry.
- Admin table dùng nền neutral và status badge để giảm nhiễu thị giác.
- AI feature dùng màu assistive nhưng phải đi kèm label như "AI gợi ý", "Cần duyệt", "Thiếu nguồn".
- Không dùng gradient làm nền chính cho dashboard hoặc form vận hành.

