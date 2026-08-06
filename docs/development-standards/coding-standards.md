# Coding Standards / Chuẩn code

## Purpose / Mục tiêu

Chuẩn code này áp dụng cho toàn bộ HealthyHub khi bắt đầu sinh code ở các prompt sau. Mục tiêu là code rõ trách nhiệm, dễ test, không trùng logic và không lệch specification.

## Core Rules / Quy tắc cốt lõi

| Rule / Quy tắc | Standard / Chuẩn |
| --- | --- |
| TypeScript strict | Bắt buộc bật strict mode khi cấu hình TypeScript ở phase implementation. |
| Avoid any | Không dùng `any` nếu không có lý do rõ; nếu bắt buộc phải ghi chú lý do trong report hoặc comment cần thiết. |
| Small responsibility | File, class và function chỉ xử lý một trách nhiệm rõ. |
| No duplicate business logic | Business rule không được copy lặp ở frontend/backend; backend là nguồn quyết định nghiệp vụ. |
| No hardcode | Không hardcode URL, secret, role, permission, status nghiệp vụ hoặc provider config. |
| English code naming | Tên biến, hàm, class, interface, type, enum, database và API dùng tiếng Anh. |
| Vietnamese UI | Text hiển thị cho người dùng dùng tiếng Việt. |
| Vietnamese comments | Comment bằng tiếng Việt, chỉ dùng khi logic khó hiểu hoặc có quyết định quan trọng. |

## Function Rule / Quy tắc function

- Function phải có mục đích rõ, tên thể hiện hành động.
- Function không nên vừa validate, vừa gọi database, vừa format response nếu không thuộc orchestration service.
- Function xử lý business rule quan trọng phải có test.
- Function có side effect như ghi database, gọi gateway hoặc gửi notification phải đặt trong layer phù hợp.

## Class Rule / Quy tắc class

- Class chỉ đại diện một trách nhiệm như service, repository, controller, guard, pipe hoặc gateway adapter.
- Không tạo class chỉ để gom helper tĩnh nếu module không cần.
- Class trong business layer không phụ thuộc trực tiếp provider bên ngoài.

## Interface Type Enum Rule / Quy tắc interface, type, enum

- Interface dùng cho contract hành vi hoặc object shape cần mở rộng.
- Type dùng cho union, alias hoặc cấu trúc dữ liệu đơn giản.
- Enum chỉ dùng khi tập giá trị ổn định và được specification công nhận.
- Constant dùng cho giá trị kỹ thuật ổn định, không dùng để che giấu config đáng ra nằm trong environment.

## Reuse Rule / Quy tắc tái sử dụng

- Tái sử dụng helper chung khi có ít nhất hai nơi dùng cùng một logic kỹ thuật.
- Không tạo abstraction sớm nếu chỉ dùng một lần.
- Business rule dùng chung phải nằm ở business/domain service phù hợp, không đặt trong UI component hoặc controller.

## File Size Responsibility / Trách nhiệm và kích thước file

- File quá dài phải được tách khi có nhiều trách nhiệm thật sự khác nhau.
- Không tách file chỉ vì muốn nhiều file nếu logic vẫn thuộc cùng một trách nhiệm nhỏ.
- Page/component có nhiều state phức tạp nên tách hook/service hoặc component con theo feature.

## Prohibited / Không được làm

- Không viết code không có specification hoặc không có context liên quan.
- Không sửa architecture, stack, API hoặc database theo suy đoán.
- Không xóa code đang hoạt động nếu chưa chứng minh cần thiết.
- Không ghi secret, token, password hoặc dữ liệu nhạy cảm vào source, log hoặc prompt.

