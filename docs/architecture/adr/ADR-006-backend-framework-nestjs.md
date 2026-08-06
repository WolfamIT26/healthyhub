# ADR-006 Backend Framework NestJS / Quyết định backend framework NestJS

## Status / Trạng thái

Accepted / Đã chấp nhận.

## Date / Ngày

2026-08-06.

## Context / Bối cảnh

Framework ban đầu cho phép backend dùng NestJS hoặc Express.js. Prompt 12.5 khóa Technology Stack cho giai đoạn sinh code HealthyHub là Node.js, NestJS và TypeScript.

## Decision / Quyết định

HealthyHub chọn NestJS làm backend framework chính cho phase implementation.

## Rationale / Lý do

- NestJS phù hợp Modular Monolith vì có module, controller, service, guard, interceptor, pipe và filter rõ ràng.
- NestJS giúp chuẩn hóa dependency direction giữa Presentation, Business, Data, AI và Gateway Layer.
- NestJS hỗ trợ tốt validation, authentication, authorization, error handling, testing và OpenAPI ở các phase sau.
- Việc khóa một backend framework giúp AI Agent sinh code nhất quán hơn.

## Consequences / Hệ quả

- Backend implementation sau này không dùng Express.js như framework chính.
- Development Standards, Project Rules và Technology Context phải ghi NestJS là chuẩn.
- Nếu muốn đổi backend framework trong tương lai, phải tạo ADR mới và cập nhật Development Standards.

