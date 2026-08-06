# Folder Convention / Quy ước thư mục

## Purpose / Mục tiêu

Folder convention giúp các AI Agent tạo file đúng vị trí, không làm trùng cấu trúc và giữ Modular Monolith dễ tách microservice sau này.

## Root Folder Rule / Quy tắc thư mục gốc

- Source code nằm trong `apps` và `packages`.
- Specification nằm trong `.spec`.
- Tài liệu chuẩn nằm trong `docs`.
- AI operating system nằm trong `.ai`.
- Asset dùng chung nằm trong `assets`.
- Tài nguyên thiết kế/prototype nằm trong `design`.
- File upload/runtime local nằm trong `storage`, không commit dữ liệu thật.

## Frontend Folder Rule / Quy tắc frontend

- `apps/web/src/pages` chứa page theo route.
- `apps/web/src/modules` chứa UI/logic theo feature.
- `apps/web/src/components` chứa component dùng chung theo Design System.
- `apps/web/src/services` chứa API client/service.
- `apps/web/src/shared` chứa type/helper dùng chung.
- Không đặt business logic phức tạp trong `components`.

## Backend Folder Rule / Quy tắc backend

- `apps/api/src/presentation` chứa controller/route layer.
- `apps/api/src/business` chứa use case/service/domain logic.
- `apps/api/src/data` chứa repository/persistence.
- `apps/api/src/ai` chứa AI layer nội bộ.
- `apps/api/src/gateways` chứa gateway abstraction và adapter.
- Không truy cập database trực tiếp từ presentation layer.

## Documentation Folder Rule / Quy tắc tài liệu

- Development Standards nằm trong `docs/development-standards`.
- Design System nằm trong `docs/design-system`.
- Work summary sau mỗi task nằm trong `docs/work-summaries`.
- Module docs dùng template trong `docs/modules/_template`.

