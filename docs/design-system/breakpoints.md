# Breakpoints / Điểm responsive

## Purpose / Mục tiêu

Breakpoints giúp Web-first nhưng vẫn chuẩn bị Mobile App và mobile viewport. Tài liệu này chỉ mô tả mốc thiết kế và hành vi, không viết CSS.

## Breakpoint Scale / Thang breakpoint

| Token / Token | Width / Độ rộng | Usage / Cách dùng |
| --- | --- | --- |
| `breakpoint.mobile` | Dưới 640 | Điện thoại, một cột, navigation rút gọn. |
| `breakpoint.tablet` | 640 đến dưới 1024 | Tablet, hai cột có kiểm soát, drawer/filter linh hoạt. |
| `breakpoint.desktop` | 1024 đến dưới 1440 | Desktop phổ biến, admin sidebar và table đầy đủ. |
| `breakpoint.wide` | Từ 1440 | Màn rộng, tăng container nhưng không kéo dài text quá mức. |

## Responsive Rule / Quy tắc responsive

- Product card không bị vỡ text tên sản phẩm dài.
- Button text phải vừa trong container; nếu dài thì xuống dòng hoặc dùng label ngắn hơn.
- Table admin trên mobile cần dạng compact list hoặc cột ưu tiên.
- Modal trên mobile có thể chuyển thành drawer nếu nội dung dài.
- Sticky action bar không che nội dung hoặc toast.

