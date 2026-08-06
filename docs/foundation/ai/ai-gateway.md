# AI Gateway / Cổng AI

## Purpose / Mục tiêu

AI Gateway là điểm điều phối giữa hệ thống và AI provider. Nó giúp business module không phụ thuộc trực tiếp vào provider, model, SDK hoặc response format cụ thể.

## Responsibilities / Trách nhiệm

- Chuẩn hóa request và response.
- Gắn prompt version và context pack version.
- Kiểm soát timeout, retry và fallback.
- Ghi log request metadata và lỗi.
- Che giấu API key và provider detail.
- Áp dụng safety filter hoặc review rule khi cần.

## Contract Rule / Quy tắc contract

AI Gateway contract phải nêu rõ:

- Task type.
- Input schema.
- Context source.
- Output schema.
- Error code nội bộ.
- Timeout.
- Logging level.
- Data privacy requirement.

## Provider Rule / Quy tắc provider

Chọn hoặc đổi AI provider phải có ADR. Không viết business logic phụ thuộc vào response riêng của provider nếu có thể mapping ở gateway.

## Related / Liên quan

- [Gateway Architecture / Kiến trúc gateway](../architecture/gateway-architecture.md)
- [Secret Management Guideline / Quản lý secret](../security/secret-management-guideline.md)

