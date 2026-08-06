# Business Blueprint / Bản thiết kế nghiệp vụ

## Purpose / Mục tiêu

Thư mục `docs/business-blueprint` là bộ tài liệu nghiệp vụ tổng thể cho HealthyHub. Tài liệu này mô tả sản phẩm, người dùng, domain, rule, module, feature, AI capability, journey, flow, permission, acceptance criteria, non-functional requirements và version planning.

## Scope / Phạm vi

Business Blueprint chỉ phân tích và đặc tả nghiệp vụ. Không thiết kế database, không tạo API, không tạo giao diện, không tạo frontend/backend và không viết code.

## Documents / Danh sách tài liệu

- [Business Strategy / Chiến lược kinh doanh](01-business-strategy.md)
- [Target Users / Người dùng mục tiêu](02-target-users.md)
- [Business Domains / Domain nghiệp vụ](03-business-domains.md)
- [Business Rules / Quy tắc nghiệp vụ](04-business-rules.md)
- [Module Map / Bản đồ module](05-module-map.md)
- [Feature Map / Bản đồ tính năng](06-feature-map.md)
- [AI Feature Map / Bản đồ tính năng AI](07-ai-feature-map.md)
- [User Journeys / Hành trình người dùng](08-user-journeys.md)
- [Business Flows / Luồng nghiệp vụ](09-business-flows.md)
- [Permission Matrix / Ma trận phân quyền](10-permission-matrix.md)
- [Acceptance Criteria / Tiêu chí hoàn thành](11-acceptance-criteria.md)
- [Non Functional Requirements / Yêu cầu phi chức năng](12-non-functional-requirements.md)
- [Version Planning / Kế hoạch phiên bản](13-version-planning.md)

## Usage Rule / Quy tắc sử dụng

- Prompt thiết kế hệ thống sau này phải đọc Business Blueprint trước khi thiết kế database, API hoặc UI.
- Nếu nghiệp vụ thay đổi, cập nhật tài liệu trong thư mục này trước rồi mới cập nhật module/spec liên quan.
- Khi chuyển sang `.spec/features`, chỉ lấy phần feature cụ thể, không sao chép toàn bộ blueprint.

