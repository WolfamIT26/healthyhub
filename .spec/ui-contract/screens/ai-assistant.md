# AI Assistant Screen / Màn hình AI hỗ trợ

## Screen Overview / Tổng quan màn hình

Màn hình AI Assistant hỗ trợ chat, tìm kiếm sản phẩm, gợi ý sản phẩm, so sánh sản phẩm và câu hỏi FAQ public-safe/customer-safe.

## Business Goal / Mục tiêu kinh doanh

Giúp khách tìm sản phẩm phù hợp nhanh hơn, hiểu thông tin sản phẩm rõ hơn và giảm tải chăm sóc khách hàng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/ai` | AI assistant public/customer. |

## Permission / Phân quyền

Guest chỉ dùng dữ liệu public-safe; customer có thể dùng dữ liệu cá nhân nếu có scope.

## Required API / API bắt buộc

- `POST /api/v1/ai/chat`.
- `POST /api/v1/ai/search/products`.
- `POST /api/v1/ai/recommendations/products`.
- `POST /api/v1/ai/compare/products`.
- `POST /api/v1/ai/feedback`.

## Required Data / Dữ liệu bắt buộc

AI interaction, answer, product items, confidence, sources, safety, fallback, metadata.

## UI Sections / Khu vực UI

Conversation area, input area, suggested prompts, product result cards, source list, safety notice, feedback action.

## Components / Thành phần

Chat Panel, Prompt Input, Product Card, Source List, Confidence Badge, Safety Notice, Feedback Buttons.

## Form / Form

Prompt input và optional product compare selector.

## Validation / Validation

Input không rỗng, giới hạn độ dài, không cho upload trực tiếp nếu chưa qua Media API.

## Search / Tìm kiếm

AI product search theo intent, không thay thế Product List filter.

## Filter / Lọc

Có thể dùng category/goal public-safe nếu API cho phép.

## Sort / Sắp xếp

AI result order theo response, không tự sort nếu có explanation/ranking.

## Pagination / Phân trang

Không áp dụng cho chat hiện tại; product result có thể giới hạn số item.

## Upload / Upload

Không upload trực tiếp ở màn hình public; OCR/Vision file phải qua Media API nếu bật sau.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Hiển thị AI đang xử lý và khóa submit trùng.

## Empty State / Trạng thái rỗng

Hiển thị prompt gợi ý khi chưa có hội thoại.

## Error State / Trạng thái lỗi

Provider unavailable, safety blocked, low confidence hoặc scope denied hiển thị theo AI error contract.

## Success State / Trạng thái thành công

Answer, product suggestions, source policy và feedback action hiển thị rõ.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng cho chat thường; có thể cần confirm khi dùng dữ liệu cá nhân trong tương lai.

## Toast Message / Toast

Feedback gửi thành công hoặc lỗi AI tạm thời.

## Skeleton / Skeleton

Skeleton message/result card cho request đang xử lý.

## Responsive Behavior / Hành vi responsive

Mobile ưu tiên input cố định dễ dùng; desktop có thể hiển thị source/result cạnh conversation ở bước design sau.

## Accessibility / Khả năng tiếp cận

Input có label, AI safety notice đọc được bằng text, product suggestions dùng link rõ.

## SEO Metadata / SEO metadata

Không ưu tiên SEO nếu AI assistant cần dynamic/private context; public landing metadata cơ bản có thể có.

