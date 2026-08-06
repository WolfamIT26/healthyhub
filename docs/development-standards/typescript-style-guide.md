# TypeScript Style Guide / Chuẩn TypeScript

## Purpose / Mục tiêu

TypeScript phải giúp phát hiện lỗi sớm, bảo vệ contract giữa frontend, backend, mobile tương lai và AI Layer. TypeScript không được dùng như JavaScript có thêm annotation hình thức.

## Strict Mode / Chế độ strict

- Bắt buộc dùng strict mode trong cấu hình TypeScript khi implementation bắt đầu.
- Không tắt strict rule cục bộ nếu chưa có lý do rõ trong report.
- Không bỏ qua lỗi type bằng assertion tùy tiện.

## Type Safety / An toàn kiểu

| Area / Khu vực | Rule / Quy tắc |
| --- | --- |
| API data | Type phải bám Data Contract, không bám trực tiếp database column. |
| Form data | Type của form phải phản ánh validation rule. |
| Enum | Enum phải mapping với Enum Contract hoặc specification. |
| Error | Error object phải mapping Error Standard và API Specification. |
| AI response | AI response type phải có source/confidence/safety khi contract yêu cầu. |

## Any Unknown Rule / Quy tắc any và unknown

- Không dùng `any` làm mặc định.
- Dùng `unknown` khi dữ liệu thật sự chưa biết, sau đó validate trước khi dùng.
- Nếu dùng `any` vì thư viện hoặc provider chưa có type tốt, phải ghi chú lý do và giới hạn phạm vi.

## Null Undefined Rule / Quy tắc null và undefined

- Dùng theo Data Contract, không tự ý đổi `null` thành empty string.
- Empty collection trả về danh sách rỗng, không trả `null`.
- Optional field phải có ý nghĩa rõ: không gửi, chưa có, hoặc không áp dụng.

## Naming Rule / Quy tắc đặt tên TypeScript

- Interface, type, class dùng PascalCase.
- Variable, function, method dùng camelCase.
- Constant kỹ thuật dùng UPPER_SNAKE_CASE khi là hằng số toàn cục.
- File name dùng kebab-case theo quy ước thư mục.

## Module Boundary / Ranh giới module

- Type dùng chung giữa app/package phải đặt ở vùng shared phù hợp khi có nhu cầu thật.
- Không import type từ module nội bộ khác nếu phá ranh giới dependency.
- Contract type phải được sinh hoặc định nghĩa từ specification ở phase sau, không tự nghĩ field.

