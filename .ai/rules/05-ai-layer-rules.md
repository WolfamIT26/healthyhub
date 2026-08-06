# AI Layer Rules / Quy tắc AI Layer

## Position / Vị trí

AI là layer toàn hệ thống, không chỉ là một module riêng.

## AI Gateway / Gateway AI

Mọi gọi provider AI phải đi qua AI Gateway hoặc service contract tương đương.

## Prompt Safety / An toàn prompt

- Không đưa secret vào prompt.
- Chống prompt injection bằng instruction rõ và validation đầu vào.
- Log prompt phải tránh dữ liệu nhạy cảm.
- Có fallback khi provider lỗi.

## Documentation / Tài liệu

Mỗi AI feature phải có mục tiêu, input, output, safety rule, fallback, test case và chi phí dự kiến.

