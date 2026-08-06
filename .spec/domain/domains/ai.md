# AI Domain / Domain AI

## Purpose / Mục đích

Quản lý năng lực AI toàn hệ thống như chat, recommendation, search, compare, OCR, vision, marketing và analytics ở mức domain.

## Responsibility / Trách nhiệm

- Bảo vệ AI boundary, context policy, safety rule và fallback.
- Đảm bảo AI output không vượt phạm vi dữ liệu được phép.
- Chuẩn bị boundary cho AI Gateway, OCR Gateway và Vision Gateway.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `AIInteraction`
- Entity: `PromptContext`, `AIOutputReview`, `AIKnowledgeSource`, `AISafetyFlag`
- Value Object: `PromptVersion`, `ContextScope`, `OutputConfidence`, `FallbackReason`
- Enum: `AICapabilityType`, `AIInteractionStatus`, `AISafetyLevel`

## Relationships / Quan hệ với domain khác

- AI đọc Product, Customer, Order, Analytics, Media, Blog và Knowledge theo policy.
- AI không sở hữu dữ liệu gốc.
- Notification và Staff có thể nhận escalation từ AI Chat/Support.

## Business Rule / Quy tắc nghiệp vụ

- AI chỉ hỗ trợ, không tự quyết định thay staff/manager/admin.
- AI không dùng dữ liệu nhạy cảm nếu chưa có policy.
- AI nutrition không chẩn đoán hoặc chỉ định y tế.
- AI output cần fallback khi thiếu dữ liệu hoặc độ tin cậy thấp.

## Domain Event / Sự kiện domain

- `AIInteractionRequested`
- `AIOutputGenerated`
- `AIOutputRejected`
- `AIInteractionEscalated`
- `AISafetyFlagRaised`

## Dependency / Phụ thuộc

- Cross-cutting dependency: Product, Customer, Order, Analytics, Media, Blog, Settings
- Gateway dependency future: AI Gateway, OCR Gateway, Vision Gateway

## Boundary / Ranh giới

AI không quản lý catalog, order, customer hoặc analytics data. Domain này quản lý cách AI sử dụng dữ liệu, tạo output và kiểm soát rủi ro.

