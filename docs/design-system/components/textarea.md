# Textarea / Ô nhập nhiều dòng

## Purpose / Mục đích

Textarea dùng cho nội dung dài như mô tả sản phẩm, ghi chú đơn hàng, lý do hủy, nội dung blog ngắn, prompt AI hoặc phản hồi chăm sóc khách.

## Variant / Biến thể

- Standard: nhập nội dung nhiều dòng.
- Counter: có đếm ký tự.
- Review: nhập đánh giá khách hàng.
- Admin Note: ghi chú vận hành.
- AI Prompt: nhập yêu cầu tạo nội dung AI.

## Size / Kích thước

Small cho ghi chú ngắn, medium cho form mặc định, large cho prompt/nội dung dài.

## State / Trạng thái

Default, focus, filled, disabled, invalid, autosize pending, submitting.

## Accessibility / Khả năng tiếp cận

Phải có label, helper và mô tả giới hạn ký tự nếu có. Error không chỉ đổi màu viền.

## Responsive Rule / Quy tắc responsive

Mobile tránh textarea quá cao làm che action chính. Admin drawer cần textarea vừa đủ để không đẩy nút lưu khỏi vùng nhìn.

## Usage / Cách dùng

Dùng khi người dùng cần diễn đạt hơn một dòng hoặc cần ghi lý do nghiệp vụ.

## Do / Nên

- Dùng counter cho nội dung có giới hạn.
- Gợi ý nội dung cần nhập bằng helper text.
- Yêu cầu lý do cho action nhạy cảm nếu business rule cần.

## Don't / Không nên

- Không dùng textarea cho dữ liệu cấu trúc như trạng thái, role, category.
- Không cho AI prompt chứa secret hoặc dữ liệu nhạy cảm.
- Không để textarea tự mở rộng làm vỡ modal.

