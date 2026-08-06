# Typography / Chữ

## Purpose / Mục tiêu

Typography giúp nội dung tiếng Việt dễ đọc, dễ quét và phù hợp cả storefront lẫn admin. Prompt này chỉ định nghĩa cấp chữ và cách dùng, không viết CSS.

## Font Strategy / Chiến lược font

- Ưu tiên system font để giảm phụ thuộc và tải nhanh.
- Font phải hỗ trợ tiếng Việt đầy đủ dấu.
- Không dùng font trang trí cho nội dung sản phẩm, checkout, admin hoặc AI output.
- Không scale font theo viewport width.
- Letter spacing mặc định là `0`.

## Type Scale / Thang chữ

| Token / Token | Size / Kích thước | Line Height / Dòng | Usage / Cách dùng |
| --- | --- | --- | --- |
| `type.display` | 40 | 48 | Hero hoặc tiêu đề trang public thật sự quan trọng. |
| `type.heading.1` | 32 | 40 | Tiêu đề trang chính. |
| `type.heading.2` | 24 | 32 | Tiêu đề section lớn. |
| `type.heading.3` | 20 | 28 | Tiêu đề card, form group, admin panel. |
| `type.body.large` | 18 | 28 | Mô tả sản phẩm hoặc nội dung blog nổi bật. |
| `type.body.default` | 16 | 24 | Body text, form label, nội dung chính. |
| `type.body.small` | 14 | 20 | Metadata, helper text, table phụ. |
| `type.caption` | 12 | 16 | Badge, timestamp, note ngắn. |

## Weight Rule / Quy tắc độ đậm

| Weight / Độ đậm | Usage / Cách dùng |
| --- | --- |
| Regular | Body text và mô tả dài. |
| Medium | Label, button, tab, navbar item. |
| Semibold | Heading nhỏ, card title, table header. |
| Bold | Heading lớn hoặc con số KPI quan trọng. |

## UI Text Rule / Quy tắc chữ giao diện

- Label phải ngắn, rõ và dùng tiếng Việt.
- Error message nêu cách sửa, không đổ lỗi người dùng.
- AI disclaimer phải ngắn nhưng đủ giới hạn trách nhiệm.
- Admin label nên dùng thuật ngữ thống nhất từ Domain Model và Business Blueprint.

