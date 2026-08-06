# Code Review Standard / Chuẩn review code

## Purpose / Mục tiêu

Code Review kiểm tra lỗi, rủi ro bảo mật, lệch specification, thiếu test và ảnh hưởng maintainability trước khi merge.

## Review Checklist / Checklist review

- Có bám specification không.
- Có thay đổi API/Data Contract/Database/UI Contract mà chưa cập nhật tài liệu không.
- Có business logic bị đặt sai layer không.
- Có duplicate logic không.
- Có hardcode URL, secret, role, status hoặc provider không.
- Có validation đầy đủ không.
- Có permission đúng không.
- Có error mapping đúng contract không.
- Có log dữ liệu nhạy cảm không.
- Có test phù hợp rủi ro không.
- Có performance issue như N+1 hoặc list không pagination không.
- Có accessibility/responsive issue với UI không.

## Severity / Mức độ lỗi

| Severity / Mức | Meaning / Ý nghĩa |
| --- | --- |
| Critical | Gây mất dữ liệu, lộ secret, sai tiền/đơn hàng/quyền, crash nghiêm trọng. |
| High | Lỗi security, business rule, data consistency hoặc UX chính. |
| Medium | Thiếu test, lỗi edge case, maintainability kém. |
| Low | Naming, style, docs nhỏ hoặc cải thiện dễ sửa. |

## Approval Rule / Quy tắc duyệt

Không approve khi còn Critical hoặc High chưa xử lý. Medium phải có kế hoạch rõ nếu chưa sửa ngay.

