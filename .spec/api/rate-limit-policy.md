# Rate Limit Policy / Chính sách giới hạn gọi API

## Purpose / Mục tiêu

Tài liệu này định nghĩa mức rate limit theo nhóm endpoint. Con số cụ thể sẽ được chốt ở bước triển khai hoặc environment configuration, Prompt 10 chỉ phân loại mức độ.

## Rate Limit Levels / Các mức giới hạn

| Level / Mức | Usage / Cách dùng | Guidance / Hướng dẫn |
| --- | --- | --- |
| Public Normal | Browse public content | Cho phép lưu lượng cao, có cache. |
| Authenticated Normal | Dữ liệu người dùng thông thường | Giới hạn theo user/session/IP. |
| Strict | Action có ghi dữ liệu hoặc rủi ro | Giới hạn chặt theo user/session/IP. |
| Very Strict | Login, OTP, reset password | Bảo vệ brute force và abuse. |
| Cost Strict | AI, export, import, upload lớn | Giới hạn theo cost, tenant và actor. |
| Provider Strict | Webhook/provider | Giới hạn theo provider signature/API key/IP allowlist nếu có. |

## Endpoint Group Policy / Chính sách theo nhóm endpoint

| Endpoint Group / Nhóm endpoint | Level / Mức |
| --- | --- |
| Public products/categories/brands/blog | Public Normal |
| Authentication login/register/reset/verify | Very Strict |
| Customer profile/cart/wishlist/orders/reviews | Authenticated Normal hoặc Strict theo action |
| Admin management CRUD | Authenticated Normal |
| Admin status/action/cancel/refund/adjust | Strict |
| Upload/import/export | Cost Strict |
| AI chat/search/recommendation/vision/OCR/analytics | Cost Strict |
| Payment/shipping/notification webhooks | Provider Strict |

## Response Rule / Quy tắc response

- Khi vượt rate limit, trả `429` và error code `RATE_LIMIT.COMMON.TOO_MANY_REQUESTS`.
- Response nên có `retryAfter` nếu có thể.
- Không trả chi tiết nội bộ về rule chống abuse.

