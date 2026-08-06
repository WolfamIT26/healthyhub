# Border Radius / Bo góc

## Purpose / Mục tiêu

Border radius giúp giao diện mềm vừa đủ nhưng không làm hệ thống thương mại/admin trở nên thiếu nghiêm túc.

## Radius Scale / Thang bo góc

| Token / Token | Value / Giá trị | Usage / Cách dùng |
| --- | --- | --- |
| `radius.none` | 0 | Table divider, layout cần vuông rõ. |
| `radius.xs` | 2 | Focus ring hoặc indicator nhỏ. |
| `radius.sm` | 4 | Input nhỏ, badge nhỏ. |
| `radius.md` | 6 | Button, input, select, table control. |
| `radius.lg` | 8 | Card, modal content block, product card. |
| `radius.xl` | 12 | Drawer/modal container nếu cần phân lớp rõ. |
| `radius.pill` | Full pill | Badge/tag/switch handle, không dùng cho card. |

## Usage Rule / Quy tắc sử dụng

- Card dùng tối đa 8 để giữ cảm giác chuyên nghiệp.
- Button và input ưu tiên 6 để nhất quán với admin UI.
- Badge/tag có thể dùng pill nếu nội dung ngắn.
- Không dùng bo góc lớn cho bảng, dashboard hoặc panel vận hành.

