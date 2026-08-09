# HealthyHub Homepage V1

## Phạm vi

Homepage `/` là storefront presentation dùng Design System chung. Trang gồm Header, Hero + search entry, Category Preview, Featured Products, Why HealthyHub, AI Preview, Lifestyle, Promotion, Blog Preview và Footer.

Product, Category, Promotion, Blog và AI chưa gọi API trong V1. Dữ liệu trình bày có type riêng tại `apps/web/src/features/home/homepage.data.ts`, sẵn sàng thay bằng public API sau này.

## Điều hướng

- `/products`, `/products/:id`: route foundation, chưa có catalog/cart logic.
- `/promotions`: route foundation, chưa có promotion runtime.
- `/blog`, `/blog/:id`: route foundation, chưa có CMS runtime.
- `/ai`: route foundation, chưa có AI runtime.
- Login/Register và trạng thái authenticated dùng Authentication context hiện tại.

## UI và accessibility

- Header desktop/mobile có navigation semantic, focus-visible và menu button với `aria-expanded`/`aria-controls`.
- Ảnh hero tải ưu tiên; ảnh AI dưới fold lazy-load và khai báo kích thước.
- Grid co theo breakpoint, tap target tối thiểu 44px và không tràn ngang ở 390/820/1024/1440px.
- Customer chưa xác minh tiếp tục thấy Email Verification Banner trên Homepage.

## Quy tắc

- Không đặt mock trong JSX; cập nhật source typed duy nhất.
- Không giả lập thêm giỏ hàng, mua thành công hoặc kết quả AI.
- Nội dung AI/dinh dưỡng chỉ mang tính tham khảo, không đưa claim y tế.
