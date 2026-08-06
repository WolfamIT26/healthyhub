# Switch / Công tắc

## Purpose / Mục đích

Switch dùng cho bật/tắt trạng thái nhị phân như active product, notification preference, dark mode hoặc publish setting có rủi ro thấp.

## Variant / Biến thể

- Standard: bật/tắt thường.
- With Label: có mô tả trạng thái.
- Controlled Critical: bật/tắt nhạy cảm cần confirmation.

## Size / Kích thước

Default cho form. Compact chỉ dùng trong table admin khi có đủ label.

## State / Trạng thái

Off, on, focus, disabled, loading, error rollback.

## Accessibility / Khả năng tiếp cận

Phải có label mô tả điều được bật/tắt. Không chỉ dùng màu để thể hiện on/off.

## Responsive Rule / Quy tắc responsive

Mobile switch cần vùng bấm đủ rộng và label đặt cạnh hoặc trên control rõ ràng.

## Usage / Cách dùng

Dùng cho preference và trạng thái có thể bật/tắt nhanh. Với trạng thái ảnh hưởng khách hàng hoặc bảo mật, cần confirmation.

## Do / Nên

- Dùng switch cho trạng thái có hiệu lực ngay hoặc gần như ngay.
- Hiển thị loading khi chờ API.
- Rollback trạng thái nếu cập nhật lỗi.

## Don't / Không nên

- Không dùng switch cho lựa chọn nhiều giá trị.
- Không dùng switch cho action không thể hoàn tác nếu chưa xác nhận.
- Không để switch không có label.

