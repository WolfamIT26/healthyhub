# Architecture Context / Ngữ cảnh kiến trúc

## Pattern / Mẫu kiến trúc

Modular Monolith là kiến trúc chính. Mỗi module cần có ranh giới rõ và có khả năng tách Microservice trong tương lai.

## Layers / Các lớp

- Presentation Layer.
- Gateway Layer.
- Business Layer.
- Data Layer.
- AI Layer.

## Dependency Direction / Hướng phụ thuộc

Presentation gọi API. API đi vào Business Layer. Business Layer gọi Data Layer hoặc Gateway Layer thông qua contract. AI Layer được dùng xuyên module nhưng phải đi qua gateway hoặc service contract rõ ràng.

