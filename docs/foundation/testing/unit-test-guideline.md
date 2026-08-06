# Unit Test Guideline / Hướng dẫn unit test

## Purpose / Mục tiêu

Unit test kiểm tra logic nhỏ và độc lập. Unit test phải nhanh, dễ đọc và không phụ thuộc database thật, network thật hoặc provider thật.

## What to Test / Cần test gì

- Business rule.
- Validation rule.
- Permission decision.
- Data mapping.
- Error handling.
- Pure utility function.
- Prompt formatting logic nếu có.

## Quality Rule / Quy tắc chất lượng

Test name phải nói rõ hành vi kỳ vọng. Test không nên chỉ kiểm tra implementation detail khiến refactor nhỏ cũng làm test hỏng.

## Related / Liên quan

- [Coding Standard / Chuẩn code](../standards/coding-standard.md)
- [Integration Test Guideline / Hướng dẫn integration test](integration-test-guideline.md)

