# Module Done Definition / Định nghĩa hoàn thành module

## Purpose / Mục tiêu

Module Done Definition là tiêu chuẩn cuối cùng để đánh giá một module HealthyHub đã hoàn thành hay chưa.

## Done Criteria / Tiêu chí hoàn thành

- Đúng specification.
- Frontend, backend và database đồng bộ.
- Validation đầy đủ ở frontend/backend/database khi phù hợp.
- Permission đúng.
- Không lộ secret.
- Có loading, skeleton, empty, error và success state nếu module có UI async.
- Responsive và accessibility đạt yêu cầu.
- Lint, test và build thành công.
- Không còn lỗi Critical hoặc High.
- Swagger/OpenAPI và tài liệu được cập nhật nếu có API.
- Status, Report, Checklist và ChangeLog đã cập nhật.

## Documentation Done / Hoàn thành tài liệu

- Module `README.md` mô tả mục tiêu và phạm vi.
- `Requirement.md` bám feature spec.
- `Database.md` cập nhật nếu schema/data thay đổi.
- `API.md` cập nhật nếu endpoint/contract thay đổi.
- `Frontend.md` cập nhật nếu UI/flow/component thay đổi.
- `Backend.md` cập nhật nếu service/gateway/module thay đổi.
- `Testing.md` ghi test đã chạy và còn thiếu.
- `Decision.md` ghi quyết định mới nếu có.
- `TODO.md` ghi phần chưa làm nếu có.

## Not Done / Chưa hoàn thành

Module chưa được xem là hoàn thành nếu còn lỗi bảo mật nghiêm trọng, lệch contract, thiếu permission, chưa test luồng chính, chưa cập nhật tài liệu bắt buộc hoặc còn endpoint/migration/UI tự phát không có specification.

