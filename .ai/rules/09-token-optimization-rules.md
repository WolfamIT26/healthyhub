# Token Optimization Rules / Quy tắc tối ưu token

## Purpose / Mục tiêu

Giúp AI Agent đọc đúng ngữ cảnh, tránh tải quá nhiều file không liên quan và giảm chi phí xử lý.

## Rules / Quy tắc

- Đọc file nền tảng trước, sau đó chỉ đọc module liên quan.
- Dùng `rg` để tìm file hoặc nội dung trước khi mở nhiều file.
- Tóm tắt assumption trong report thay vì lặp lại tài liệu dài.
- Không đưa dữ liệu nhạy cảm, log dài hoặc file lớn vào prompt nếu không cần.
- Với AI feature, giới hạn input, output và fallback rõ ràng.

