# Icon Guideline / Quy tắc icon

## Purpose / Mục tiêu

Icon giúp người dùng nhận diện thao tác nhanh hơn, nhất là trong admin toolbar, product action, search/filter và AI feature.

## Icon Usage / Cách dùng icon

| Context / Ngữ cảnh | Rule / Quy tắc |
| --- | --- |
| Primary button | Có thể dùng icon kèm text nếu icon tăng nhận diện hành động. |
| Icon-only button | Chỉ dùng cho action phổ biến như search, filter, close, edit, delete, download; bắt buộc có accessible label ở phase frontend. |
| Status | Dùng icon kèm text, không chỉ dùng màu. |
| AI | Dùng icon để phân biệt AI answer, source, safety, confidence và human review. |
| Admin table | Icon action cần nhất quán và có tooltip ở phase frontend. |

## Source Rule / Quy tắc nguồn icon

- Icon phải lấy từ bộ icon được dự án phê duyệt ở frontend phase.
- Không thêm package icon mới trong Prompt 12.
- Icon tùy chỉnh trong `assets/icons` phải có tên tiếng Anh rõ nghĩa và tài liệu mô tả.
- Không dùng icon trang trí nếu không hỗ trợ hiểu nội dung hoặc thao tác.

## Style Rule / Quy tắc phong cách

- Icon nét đơn giản, dễ đọc ở kích thước nhỏ.
- Icon cùng nhóm action phải cùng trọng lượng nét.
- Delete/destructive icon phải đi kèm màu/label cảnh báo.
- Không dùng icon khó hiểu cho nghiệp vụ payment, shipping, AI safety nếu chưa có tooltip.

