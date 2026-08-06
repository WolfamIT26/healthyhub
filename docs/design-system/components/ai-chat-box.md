# AI Chat Box / Khung chat AI

## Purpose / Mục đích

AI Chat Box hỗ trợ người dùng hỏi về sản phẩm, chính sách, gợi ý, so sánh, dinh dưỡng tham khảo và hỗ trợ admin/marketing theo phạm vi được duyệt.

## Variant / Biến thể

- Public Assistant: hỗ trợ guest/customer.
- Product Assistant: tư vấn trong product detail/list.
- Admin AI Panel: hỗ trợ analytics, marketing, review.
- Support Handoff: chuyển sang staff khi AI không đủ chắc chắn.

## Size / Kích thước

Compact entry cho storefront, panel cho trang AI, drawer/panel cho admin.

## State / Trạng thái

Idle, typing, generating, streaming if supported later, success, fallback, blocked, error, human review required.

## Accessibility / Khả năng tiếp cận

Tin nhắn phải phân biệt user/AI bằng label, không chỉ màu. AI disclaimer, source và confidence phải đọc được.

## Responsive Rule / Quy tắc responsive

Mobile chat box không che cart/checkout CTA. Admin AI panel giữ output và nguồn đủ rộng để review.

## Usage / Cách dùng

Dùng trong AI Assistant screen, Product Detail, Product List, Admin AI và Admin Analytics.

## Do / Nên

- Hiển thị nguồn hoặc thiếu nguồn.
- Có disclaimer cho dinh dưỡng/health claim.
- Có fallback chuyển staff hoặc search thường khi AI không đủ thông tin.

## Don't / Không nên

- Không trình bày AI như quyết định tuyệt đối.
- Không để AI tự gửi campaign hoặc thay đổi dữ liệu.
- Không đưa secret, payment data hoặc dữ liệu nhạy cảm vào prompt.

