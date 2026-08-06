# UI State Contract / Chuẩn trạng thái UI

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa trạng thái UI dùng chung cho các màn hình HealthyHub.

## Loading State / Trạng thái tải

| Context / Ngữ cảnh | Rule / Quy tắc |
| --- | --- |
| Page initial load | Hiển thị skeleton cho vùng dữ liệu chính, không nhấp nháy layout. |
| List refresh | Giữ filter/sort/page hiện tại, báo đang tải ở list region. |
| Form submit | Disable submit và action nguy hiểm cho tới khi có response. |
| AI response | Hiển thị trạng thái đang xử lý và cho phép hủy nếu backend/API hỗ trợ sau này. |
| Upload/export/import | Hiển thị job status hoặc progress metadata nếu API trả. |

## Empty State / Trạng thái rỗng

| Context / Ngữ cảnh | Rule / Quy tắc |
| --- | --- |
| No data | Nêu rõ chưa có dữ liệu. |
| No search result | Nêu rõ không có kết quả theo từ khóa/filter. |
| Empty cart | Gợi ý quay lại danh sách sản phẩm. |
| Empty admin list | Gợi ý tạo mới nếu user có quyền. |
| Empty AI source | Nêu rõ AI chưa có nguồn dữ liệu phù hợp. |

## Error State / Trạng thái lỗi

- Validation error hiển thị cạnh field.
- Permission error hiển thị message rõ và link quay lại nơi hợp lệ.
- Network/system error hiển thị retry nếu action an toàn.
- Payment/shipping/provider error cần hướng dẫn bước tiếp theo.
- AI safety blocked hiển thị message an toàn, không lộ policy nội bộ.

## Success State / Trạng thái thành công

- Form save thành công dùng toast và cập nhật dữ liệu trên màn hình.
- Order create thành công chuyển đến order detail/success.
- Upload/import/export thành công hiển thị file/job status.
- Admin status action thành công cập nhật status badge và timeline/audit summary.

## Confirmation Dialog / Hộp xác nhận

Confirmation bắt buộc với:

- Hủy đơn.
- Refund.
- Điều chỉnh tồn kho.
- Khóa/mở tài khoản.
- Đổi role/permission.
- Archive/delete resource quan trọng.
- Gửi notification/campaign hàng loạt.
- Publish nội dung hoặc AI marketing output.

## Toast Message / Toast

| Type / Loại | Rule / Quy tắc |
| --- | --- |
| Success | Ngắn, xác nhận hành động đã hoàn tất. |
| Warning | Nêu điều kiện cần chú ý nhưng không chặn. |
| Error | Nêu lỗi thân thiện và hướng xử lý nếu có. |
| Info | Dùng cho job đang xử lý hoặc trạng thái nền. |

## Skeleton / Skeleton

- Skeleton phải tương ứng vùng dữ liệu thật, không dùng chung một khối mơ hồ.
- Product list skeleton giữ kích thước card ổn định.
- Admin table skeleton giữ column width ổn định.
- Detail page skeleton giữ header, summary và section chính.

## Responsive Behavior / Hành vi responsive

- Public shopping ưu tiên mobile-first.
- Admin dashboard ưu tiên desktop/tablet nhưng vẫn đọc được trên mobile.
- Table admin có thể chuyển sang compact list ở mobile.
- Action bar quan trọng phải luôn truy cập được, không che nội dung.

## Accessibility / Khả năng tiếp cận

- Tất cả form field có label.
- Error message liên kết với field tương ứng ở bước implementation.
- Button icon-only cần accessible label khi triển khai.
- Không chỉ dùng màu để biểu diễn trạng thái.
- Modal/confirmation cần focus management ở bước frontend.

