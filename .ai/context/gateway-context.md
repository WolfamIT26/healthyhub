# Gateway Context / Ngữ cảnh Gateway

## Purpose / Mục tiêu

Gateway Layer giúp tách business logic khỏi provider bên ngoài.

## Gateways / Các gateway

- AI Gateway.
- Payment Gateway.
- Storage Gateway.
- Notification Gateway.
- OCR Gateway.
- Vision Gateway.
- Analytics Gateway.
- Integration Gateway.

## Rule / Quy tắc

Không gọi SDK provider trực tiếp trong business logic. Mọi tích hợp phải có contract, error handling, retry policy và security note.

