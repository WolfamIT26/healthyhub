# Testing / Kiểm thử

## Testing Levels / Cấp độ kiểm thử

- Unit test cho business logic quan trọng.
- Integration test cho API, database và gateway.
- E2E test cho luồng người dùng chính.
- Performance test cho endpoint có tải cao.
- Security test cho auth, payment và dữ liệu nhạy cảm.

## AI Testing / Kiểm thử AI

AI feature cần có test case cho:

- Input hợp lệ.
- Input thiếu dữ liệu.
- Input nguy hiểm hoặc prompt injection.
- Kết quả không chắc chắn.
- Fallback khi provider lỗi.

## Documentation Rule / Quy tắc tài liệu

Mỗi module phải có `Testing.md` và `Checklist.md`. Khi thêm test mới, cập nhật tài liệu module.

