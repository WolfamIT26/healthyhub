# Design Tokens / Token thiết kế

## Purpose / Mục tiêu

Design Token là ngôn ngữ chung để chuyển quyết định thiết kế sang Frontend và Mobile App sau này. Tài liệu này chỉ định nghĩa tên, ý nghĩa và giá trị thiết kế; không viết CSS hoặc code.

## Token Categories / Nhóm token

| Category / Nhóm | Purpose / Mục đích |
| --- | --- |
| Color | Màu thương hiệu, nền, chữ, viền, trạng thái, AI và chart. |
| Typography | Font family, cấp chữ, line-height và font weight. |
| Spacing | Khoảng cách giữa section, component và field. |
| Radius | Bo góc cho input, button, card, modal, badge. |
| Elevation | Cấp nổi logic cho surface, dropdown, modal, toast. |
| Shadow | Đổ bóng tương ứng elevation. |
| Grid | Cột, gutter, container và layout density. |
| Breakpoint | Mốc responsive cho mobile, tablet, desktop. |
| Motion | Thời lượng, easing và rule giảm chuyển động. |

## Naming Convention / Quy ước đặt tên

| Pattern / Mẫu | Meaning / Ý nghĩa | Example / Ví dụ |
| --- | --- | --- |
| `foundation.category.name` | Token gốc, ít thay đổi. | `foundation.color.green.600`. |
| `semantic.role.state` | Token theo mục đích sử dụng. | `semantic.text.primary`. |
| `component.name.part.state` | Token riêng cho component quan trọng. | `component.button.primary.hover`. |
| `motion.intent.speed` | Token chuyển động theo mục đích. | `motion.feedback.fast`. |

## Token Governance / Quản trị token

- Không dùng màu trực tiếp trong tài liệu màn hình nếu đã có semantic token phù hợp.
- Token mới cần có lý do rõ và ghi vào `ChangeLog.md`.
- Component nên dùng semantic token trước, foundation token sau.
- Token phải hỗ trợ dark mode bằng mapping semantic, không nhân đôi toàn bộ component.
- Mobile App sau này được dùng cùng semantic token nhưng có thể điều chỉnh density.

## Web Implementation / Triển khai Web

Prompt 19 ánh xạ token vào `apps/web/tailwind.config.ts`: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`, `neutral`; typography `xs`–`2xl`; spacing `xs`–`xl`; radius `control/card/modal`; shadow `soft/medium/overlay`; motion `standard`; container `80rem`; breakpoint `sm/md/lg/xl/2xl`. Component dùng semantic token trước, không thêm hex trực tiếp nếu token đã tồn tại.

## Core Semantic Tokens / Token ngữ nghĩa cốt lõi

| Token / Token | Light Meaning / Ý nghĩa light | Dark Meaning / Ý nghĩa dark |
| --- | --- | --- |
| `semantic.background.page` | Nền trang chính. | Nền trang tối. |
| `semantic.background.surface` | Nền card, form, table panel. | Surface nổi trên nền tối. |
| `semantic.text.primary` | Text quan trọng nhất. | Text quan trọng nhất trong dark mode. |
| `semantic.text.secondary` | Text mô tả, metadata. | Text phụ vẫn đủ tương phản. |
| `semantic.border.default` | Viền component mặc định. | Viền nhẹ trên nền tối. |
| `semantic.action.primary` | Hành động chính. | Hành động chính trong dark mode. |
| `semantic.status.success` | Thành công, đủ hàng, active. | Thành công trong dark mode. |
| `semantic.status.warning` | Cảnh báo, thiếu dữ liệu, sắp hết hàng. | Cảnh báo trong dark mode. |
| `semantic.status.danger` | Lỗi, hủy, xóa, khóa. | Nguy hiểm trong dark mode. |
| `semantic.ai.assistive` | AI hỗ trợ, insight, recommendation. | AI hỗ trợ trong dark mode. |
