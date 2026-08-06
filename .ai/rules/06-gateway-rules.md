# Gateway Rules / Quy tắc Gateway

## Purpose / Mục tiêu

Gateway cô lập business logic khỏi provider bên ngoài.

## Required Design / Thiết kế bắt buộc

Mỗi gateway cần mô tả:

- Interface.
- Provider.
- Input.
- Output.
- Error.
- Retry policy.
- Timeout.
- Rate limit.
- Security note.

## Provider Rule / Quy tắc provider

Không để provider-specific code lan vào module nghiệp vụ.

