# Shared Types / Kiểu dữ liệu dùng chung

## Purpose / Mục tiêu

Package là nguồn TypeScript contract dùng chung cho API/Web/Mobile tương lai. `src/index.ts` chứa envelope chung; `src/authentication.ts` chứa Authentication V1.

## Authentication Contracts / Contract Authentication

- Request types cho register/login/verify/resend/forgot/reset/change.
- Result và response envelope aliases cho register/login/refresh/action/current session.
- `ActorSummary`, `AuthenticationSessionSummary`, `TokenMetadata`; token metadata không chứa secret, còn access/refresh token chỉ xuất hiện ở delivery result đúng Data Contract.
- Canonical constants/types cho account/session/token purpose/role/permission/error code.

Không thêm database entity hoặc runtime business logic vào package này. Mọi thay đổi phải bám `.spec/data-contracts/authentication-contract.md` và OpenAPI.
