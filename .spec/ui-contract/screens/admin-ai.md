# Admin AI Screen / Màn hình quản trị AI

## Screen Overview / Tổng quan màn hình

Admin AI quản lý AI marketing, AI analytics insight, AI interaction history, review output và safety/source metadata.

## Business Goal / Mục tiêu kinh doanh

Khai thác AI có kiểm soát, bảo vệ dữ liệu và đảm bảo output rủi ro được duyệt trước khi dùng.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/ai` | Quản trị AI và review interaction. |

## Permission / Phân quyền

Manager/admin với `ai:marketing`, `ai:analytics`, `ai:review` hoặc `ai:admin`.

## Required API / API bắt buộc

- `POST /api/v1/admin/ai/marketing/captions`.
- `POST /api/v1/admin/ai/marketing/emails`.
- `POST /api/v1/admin/ai/analytics/insights`.
- `GET /api/v1/admin/ai/interactions`.
- `GET /api/v1/admin/ai/interactions/{interactionId}`.
- `POST /api/v1/ai/feedback`.

## Required Data / Dữ liệu bắt buộc

AI output, interactionId, capability, status, confidence, sources, safety, requiresHumanReview, metadata.

## UI Sections / Khu vực UI

AI prompt panel, output review panel, interaction table, source list, safety notice, feedback/action area.

## Components / Thành phần

AI Prompt Panel, AI Output Review, Source List, Confidence Badge, Safety Notice, Interaction Table.

## Form / Form

Prompt/input form cho marketing/analytics, feedback form cho output.

## Validation / Validation

Capability hợp lệ, input không rỗng, không vượt giới hạn, không chứa secret/token/payment data.

## Search / Tìm kiếm

Search interaction summary admin only.

## Filter / Lọc

Capability, status, safetyLevel, actorType, createdAt.

## Sort / Sắp xếp

Interaction default `createdAt` desc.

## Pagination / Phân trang

Interaction history default 20, max 100 hoặc cursor nếu API dùng.

## Upload / Upload

File AI input đi qua Admin Media/Media API, màn hình chỉ chọn media reference nếu cần.

## Download / Download

AI output export là future enhancement nếu API bổ sung.

## Loading State / Trạng thái tải

AI processing state, interaction table skeleton, output skeleton.

## Empty State / Trạng thái rỗng

Chưa có interaction hoặc chưa có output cho prompt.

## Error State / Trạng thái lỗi

Provider unavailable, safety blocked, low confidence, scope denied, invalid input.

## Success State / Trạng thái thành công

AI output hiển thị kèm source/safety và trạng thái review.

## Confirmation Dialog / Hộp xác nhận

Publish/send/use AI marketing output cần xác nhận và human review nếu required.

## Toast Message / Toast

AI output created, feedback sent, output blocked hoặc lỗi provider.

## Skeleton / Skeleton

Interaction rows và AI output placeholder skeleton.

## Responsive Behavior / Hành vi responsive

Desktop chia prompt-output-source; mobile stack từng vùng.

## Accessibility / Khả năng tiếp cận

Safety notice có text rõ, confidence không chỉ dùng màu, prompt field có label.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

