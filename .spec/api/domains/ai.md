# AI API Specification / Đặc tả API AI

## API Overview / Tổng quan API

AI API cung cấp năng lực AI toàn hệ thống: chat, recommendation, search, compare, OCR, vision, meal planner, calories, marketing, analytics, customer support, feedback và review. AI API luôn phải có confidence, source policy, safety metadata và traceability.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/ai/chat` | Chat AI hỗ trợ khách | Optional JWT hoặc Customer JWT | `ai:use` public-safe |
| POST | `/api/v1/ai/recommendations/products` | Gợi ý sản phẩm | Optional JWT hoặc Customer JWT | `ai:use` |
| POST | `/api/v1/ai/search/products` | AI product search | Public hoặc Customer JWT | `ai:use` public-safe |
| POST | `/api/v1/ai/compare/products` | So sánh sản phẩm | Public hoặc Customer JWT | `ai:use` public-safe |
| POST | `/api/v1/ai/nutrition/meal-plans` | Gợi ý meal planner | Customer JWT | `ai:nutrition` |
| POST | `/api/v1/ai/nutrition/calories` | Ước tính calories | Customer JWT | `ai:nutrition` |
| POST | `/api/v1/ai/ocr` | OCR file/ảnh | Customer JWT hoặc Staff JWT | `ai:vision` |
| POST | `/api/v1/ai/vision/food-recognition` | Nhận diện ảnh món ăn | Customer JWT | `ai:vision` |
| POST | `/api/v1/admin/ai/marketing/captions` | Sinh caption marketing | Manager/Admin JWT | `ai:marketing` |
| POST | `/api/v1/admin/ai/marketing/emails` | Sinh email marketing | Manager/Admin JWT | `ai:marketing` |
| POST | `/api/v1/admin/ai/analytics/insights` | Insight kinh doanh | Manager/Admin JWT | `ai:analytics` |
| GET | `/api/v1/admin/ai/interactions` | Lịch sử tương tác AI | Admin JWT | `ai:review` |
| GET | `/api/v1/admin/ai/interactions/{interactionId}` | Chi tiết tương tác AI | Admin JWT | `ai:review` |
| POST | `/api/v1/ai/feedback` | Gửi feedback cho AI output | Customer JWT hoặc Staff JWT | Actor scope |

## REST Resource / Tài nguyên REST

- Primary resource: `ai`.
- Capability resources: `chat`, `recommendations`, `search`, `compare`, `nutrition`, `ocr`, `vision`, `marketing`, `analytics`, `interactions`, `feedback`.

## HTTP Method / Phương thức HTTP

- POST cho AI generation/analysis/action.
- GET cho interaction history/detail admin.

## URI Convention / Quy ước URI

- Customer/public AI namespace: `/api/v1/ai`.
- Admin AI namespace: `/api/v1/admin/ai`.
- ID parameter dùng `{interactionId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.
- Prompt/model version nằm trong AI metadata, không lộ provider secret.

## Permission / Quyền

- Public-safe AI chỉ dùng dữ liệu public.
- Customer AI dùng dữ liệu owner nếu customer đăng nhập và có scope.
- Admin AI cần permission theo capability: `ai:marketing`, `ai:analytics`, `ai:review`.

## Authentication / Xác thực

- Public-safe chat/search/compare có thể optional JWT.
- Nutrition, OCR, vision và feedback cần JWT nếu dùng file/dữ liệu cá nhân.
- Admin AI bắt buộc Staff JWT có quyền.

## Authorization / Phân quyền

- AI không được vượt quyền dữ liệu nguồn.
- AI source reference chỉ trả nếu actor có quyền xem nguồn.
- Marketing output cần human review trước khi publish/send.

## Request Contract / Contract request

- AI request gồm capability, user intent, input scope, context references và safety context.
- OCR/Vision dùng media/file reference từ Media API, không gửi storage key nội bộ.
- AI action có chi phí cần idempotency key nếu request có thể retry.

## Response Contract / Contract response

- Dùng [AI Response](../../data-contracts/ai-response.md).
- Bắt buộc có interactionId, capability, status, confidence khi phù hợp, sources, safety và metadata.
- Nutrition/calories/meal planner phải có disclaimer.

## Error Contract / Contract lỗi

- `AI.AI.PROVIDER_UNAVAILABLE`
- `AI.AI.SAFETY_BLOCKED`
- `AI.AI.LOW_CONFIDENCE`
- `PERMISSION.AI.SCOPE_DENIED`
- `VALIDATION.COMMON.INVALID_INPUT`

## Validation Rule / Quy tắc validation

- Capability hợp lệ.
- Input không vượt giới hạn size/token.
- Media/file reference hợp lệ và actor có quyền.
- Không nhận prompt chứa secret/token/payment data.

## Business Rule / Quy tắc nghiệp vụ

- AI recommendation là gợi ý, không bắt buộc người dùng mua.
- AI nutrition không thay thế tư vấn y tế.
- AI analytics không tự thay đổi dữ liệu vận hành.
- Output có rủi ro cần `requiresHumanReview`.

## Pagination / Phân trang

- Interaction history dùng cursor hoặc page pagination default 20, max 100.

## Filter / Lọc

- Admin interaction list lọc theo capability, status, safetyLevel, actorType, createdAt.

## Search / Tìm kiếm

- Search interaction summary admin only.
- AI product search là endpoint riêng và chỉ dùng dữ liệu public/allowed.

## Sort / Sắp xếp

- Interaction default sort: `createdAt` desc.

## Upload / Upload

- File/ảnh upload qua Media API trước, AI API nhận mediaId/file reference.

## Download / Download

- AI output export nếu có thuộc Analytics/AI future, chưa là endpoint bắt buộc.

## Rate Limit / Giới hạn gọi API

- AI endpoint dùng Cost Strict theo actor, tenant, capability và provider cost.

## Idempotency / Chống gửi lặp

- AI request có chi phí hoặc tạo job cần idempotency key.
- Feedback idempotent theo interactionId và actor nếu cần.

## Webhook / Webhook

Không áp dụng trong Prompt 10. AI provider callback nếu có sẽ đi qua Integration Gateway hoặc AI Gateway sau này.

## AI Endpoint / Endpoint AI

Domain này chính là AI endpoint group. Mọi AI endpoint phải tuân thủ source policy, safety metadata, logging và human review rule.

