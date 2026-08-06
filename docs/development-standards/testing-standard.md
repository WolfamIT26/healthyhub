# Testing Standard / Chuẩn kiểm thử

## Purpose / Mục tiêu

Testing Standard xác định mức kiểm thử tối thiểu để module không bị đánh dấu hoàn thành khi logic quan trọng chưa được kiểm chứng.

## Test Levels / Cấp kiểm thử

| Level / Cấp | Scope / Phạm vi |
| --- | --- |
| Unit Test | Business logic quan trọng, validation rule, mapper, utility. |
| Integration Test | Database, repository, gateway abstraction, module interaction. |
| API Test | Endpoint quan trọng, auth, permission, request/response/error contract. |
| E2E Test | Luồng mua hàng chính, đăng nhập, checkout, admin order flow. |
| Security Test | Authentication, authorization, permission, upload, rate limit. |
| Responsive Test | Mobile/tablet/desktop với màn hình public và checkout. |
| Accessibility Test | Form label, focus, error, semantic state, keyboard flow. |

## Test Data / Dữ liệu test

- Test dữ liệu hợp lệ.
- Test dữ liệu không hợp lệ.
- Test edge case.
- Test error case.
- Seed test tách biệt môi trường production.

## AI Testing / Kiểm thử AI

- Kiểm fallback khi thiếu context.
- Kiểm safety blocked.
- Kiểm không lộ dữ liệu nhạy cảm.
- Kiểm source/confidence nếu contract yêu cầu.
- Kiểm human review cho AI Marketing/Analytics khi cần.

## Done Rule / Quy tắc hoàn thành

Không đánh dấu module hoàn thành nếu test quan trọng chưa chạy hoặc chưa đạt, trừ khi report ghi rõ lý do và rủi ro còn lại.

