# Project Overview / Tổng quan dự án

## Identity / Định danh

HealthyHub là nền tảng bán sản phẩm healthy, bắt đầu với web application và chuẩn bị mở rộng mobile app sau. Dự án đồng thời là dự án mẫu đầu tiên của AI Development OS, một framework phát triển Full Stack có AI hỗ trợ toàn vòng đời.

## Product Direction / Định hướng sản phẩm

HealthyHub tập trung vào trải nghiệm mua sắm sản phẩm sức khỏe, thông tin dinh dưỡng rõ ràng và khả năng hỗ trợ khách hàng bằng AI. Ở giai đoạn foundation, dự án chưa triển khai nghiệp vụ cụ thể; trọng tâm là chuẩn hóa cấu trúc, tài liệu và workflow để các phase sau triển khai nhất quán.

## Technology Baseline / Nền công nghệ

- Frontend: React, Vite, TypeScript, Tailwind CSS.
- Backend: Node.js, NestJS, TypeScript.
- Database: MySQL và SQL.
- Tools: Docker, Git, GitHub, phpMyAdmin.

NestJS được chọn làm backend framework chính từ Prompt 12.5 và được ghi nhận bằng ADR trước khi bước vào triển khai backend thật.

## Architecture Baseline / Nền kiến trúc

HealthyHub dùng Modular Monolith Architecture với các layer chính: Presentation, Gateway, Business, Data và AI. Kiến trúc này giúp bắt đầu nhanh như một hệ thống thống nhất nhưng vẫn chuẩn bị đường tách module thành microservice khi có nhu cầu vận hành thực tế.

## Documentation Role / Vai trò tài liệu

Tài liệu là nguồn tham chiếu bắt buộc, không phải phần phụ. Mọi thay đổi quan trọng về requirement, kiến trúc, database, API, bảo mật, deployment hoặc AI workflow phải được phản ánh vào tài liệu tương ứng.

## Related / Liên quan

- [Vision / Tầm nhìn](vision.md)
- [Scope / Phạm vi](scope.md)
- [Architecture Overview / Tổng quan kiến trúc](../architecture/architecture-overview.md)
- [AI Overview / Tổng quan AI](../ai/ai-overview.md)
