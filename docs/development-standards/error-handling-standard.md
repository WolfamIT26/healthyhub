# Error Handling Standard / Chuẩn xử lý lỗi

## Purpose / Mục tiêu

Error handling phải giúp người dùng hiểu lỗi, giúp developer trace lỗi và không làm lộ dữ liệu nhạy cảm.

## Error Source / Nguồn lỗi

| Source / Nguồn | Handling / Cách xử lý |
| --- | --- |
| Validation | Trả validation response theo field. |
| Business rule | Trả business error theo Error Catalog. |
| Permission | Trả lỗi quyền rõ, không lộ dữ liệu tồn tại nếu không được phép. |
| System | Log chi tiết an toàn, trả message thân thiện. |
| Gateway | Map provider error sang gateway/domain error. |
| AI | Trả fallback/blocked/error theo AI Response Contract. |

## Backend Error Rule / Quy tắc lỗi backend

- Không trả raw exception cho client.
- Error phải có code, category, message phù hợp và trace/request id theo contract.
- Validation error phải map đúng field.
- Gateway error không được lộ credential, provider payload nhạy cảm hoặc stack trace.

## Frontend Error Rule / Quy tắc lỗi frontend

- Field error hiển thị cạnh field.
- Page/list error có retry nếu action an toàn.
- Permission denied có hướng quay lại màn hình hợp lệ.
- Payment/shipping/order error cần hướng xử lý cụ thể.
- AI blocked/fallback hiển thị bằng message an toàn, không lộ policy nội bộ.

## Logging Boundary / Ranh giới logging

Log lỗi kỹ thuật ở backend/monitoring; UI chỉ hiển thị message phù hợp người dùng. Không log token, password, full payment data hoặc dữ liệu cá nhân không cần thiết.

