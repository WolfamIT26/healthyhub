# Work Summary — Prompt 20 Homepage V1

## Kết quả

- Hoàn thiện Homepage `/` theo UI Contract bằng Design System Prompt 19.
- Tạo typed presentation data tập trung cho category, product, AI feature và blog preview.
- Tích hợp Hero Illustration, AI Mascot và Logo Symbol có sẵn; không tạo/sửa asset.
- Chuẩn hóa public header desktop/mobile, footer và route foundation cho module chưa triển khai.
- Giữ nguyên Authentication logic; bổ sung Email Verification Banner vào public layout cho Customer pending.

## File chính

- `apps/web/src/pages/HomePage.tsx`
- `apps/web/src/features/home/homepage.data.ts`
- `apps/web/src/shared/layouts/PublicLayout.tsx`
- `apps/web/src/pages/ComingSoonPage.tsx`
- `apps/web/src/features/home/HomePage.spec.tsx`
- `docs/homepage.md`

## Kiểm thử

- Homepage render, Hero CTA, search validation/navigation, featured product và AI preview.
- Guest/authenticated header, mobile menu và unverified Customer banner.
- Visual/DOM tại 390, 820, 1024 và 1440px: `scrollWidth` bằng viewport, không horizontal overflow.

## Giới hạn chủ ý

- Không gọi public API chưa tồn tại.
- Không triển khai Product backend/CRUD, Cart, Checkout, Payment, Order hoặc AI runtime.
- Route foundation chỉ giải thích module đang được chuẩn bị, không giả lập nghiệp vụ thành công.
