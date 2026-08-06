# Checkbox / Ô chọn

## Purpose / Mục đích

Checkbox dùng cho lựa chọn nhiều giá trị hoặc xác nhận một điều kiện như đồng ý chính sách, chọn filter, chọn item trong table.

## Variant / Biến thể

- Single Checkbox: xác nhận một điều kiện.
- Checkbox Group: chọn nhiều giá trị.
- Table Selection: chọn nhiều dòng.
- Indeterminate: trạng thái chọn một phần.

## Size / Kích thước

Default cho form và filter. Compact cho table nhưng vùng bấm vẫn phải đủ rộng.

## State / Trạng thái

Unchecked, checked, indeterminate, focus, disabled, invalid.

## Accessibility / Khả năng tiếp cận

Label phải click được ở phase frontend. Indeterminate state cần mô tả rõ cho screen reader ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile filter group cần spacing đủ để bấm. Table selection trên mobile có thể chuyển thành action chọn trong compact list.

## Usage / Cách dùng

Dùng trong filter category/attribute, đồng ý policy, bulk action admin và preference notification.

## Do / Nên

- Dùng checkbox khi có thể chọn nhiều.
- Dùng label cụ thể, không chỉ icon.
- Hiển thị số item đã chọn trong bulk action.

## Don't / Không nên

- Không dùng checkbox cho lựa chọn loại trừ lẫn nhau; dùng Radio.
- Không giấu điều khoản quan trọng sau checkbox mơ hồ.
- Không dùng checkbox để kích hoạt action nguy hiểm ngay lập tức.

