# Inventory Feature Specification / Đặc tả tính năng tồn kho

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Products, Orders |
| Version | MVP |
| Owner | Manager, Staff |
| Status | Executable read + Order stock mutation authority |

## Overview / Tổng quan

Inventory theo dõi khả năng bán của sản phẩm, cảnh báo gần hết hàng và hỗ trợ xử lý đơn chính xác.

## Business Goal / Mục tiêu kinh doanh

Giảm rủi ro bán quá số lượng có thể phục vụ, hỗ trợ staff xử lý đơn và manager nhập hàng kịp thời.

## Scope / Phạm vi

Trong phạm vi: khả năng bán, trạng thái còn/hết hàng, cảnh báo gần hết, điều chỉnh tồn kho nghiệp vụ. Ngoài phạm vi: thiết kế bảng kho, thuật toán dự báo, tích hợp kho thật.

## Requirement / Yêu cầu

- Sản phẩm phải có trạng thái khả năng bán rõ.
- Hệ thống cảnh báo khi sản phẩm gần hết.
- Đơn hàng xác nhận phải ảnh hưởng khả năng bán theo rule sau này.
- Điều chỉnh bất thường cần lý do.

## User Story / User story

- Là Staff, tôi muốn biết sản phẩm còn hàng để xử lý đơn.
- Là Manager, tôi muốn thấy sản phẩm gần hết để nhập thêm.
- Là Customer, tôi muốn biết sản phẩm có mua được hay không.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Check availability | Customer, Staff | Biết sản phẩm có thể mua. |
| Update inventory | Staff, Manager | Khả năng bán được cập nhật. |
| Low stock alert | Manager | Nhận cảnh báo cần xử lý. |

## Business Flow / Luồng nghiệp vụ

1. Staff/Manager xem tồn kho.
2. Hệ thống hiển thị trạng thái khả năng bán.
3. Khi có thay đổi vận hành, người có quyền cập nhật.
4. Sản phẩm gần hết hoặc hết hàng được đánh dấu.
5. Đơn hàng sử dụng thông tin tồn kho để tránh bán sai.

## Validation Rule / Quy tắc validation

- Không cho số lượng khả dụng âm ở mức nghiệp vụ.
- Điều chỉnh tồn kho cần lý do nếu khác biệt lớn.
- Sản phẩm hết hàng không được đặt như còn hàng trừ khi bật đặt trước.

## Permission / Phân quyền

Customer xem trạng thái public. Staff cập nhật giới hạn. Manager/Admin quản lý tồn kho. Analytics chỉ đọc dữ liệu.

## Acceptance Criteria / Tiêu chí hoàn thành

- Tồn kho phản ánh khả năng bán.
- Có rule cảnh báo gần hết.
- Hết hàng không gây hiểu nhầm.
- Điều chỉnh nhạy cảm có lý do.

## Edge Cases / Trường hợp biên

- Nhiều khách cùng đặt sản phẩm còn ít.
- Đơn bị hủy cần hoàn khả năng bán.
- Sản phẩm tạm ngừng bán dù còn hàng.

## Error Cases / Trường hợp lỗi

- Cập nhật tồn kho không hợp lệ.
- Người thao tác không đủ quyền.
- Sản phẩm không tồn tại.

## Future Enhancement / Mở rộng tương lai

- Inventory prediction.
- Multi-location stock.
- Supplier reorder suggestion.

## Prompt 32.1 Executable Boundary / Ranh giới chạy Prompt 32.1

- `inventory_items` và `InventoryAvailabilityReader` là source of truth cho stock quantity/availability.
- Zero quantity luôn out-of-stock; missing/deleted/disabled Inventory unavailable.
- Product public chỉ trả availability/sellable, không trả internal quantity.
- Cart add/update và Order create revalidate server-side.
- OrderPlaced reserve stock atomically cho COD/VNPAY; concurrent row locks ngăn oversell.
- COD consume ngay; VNPAY pending giữ active, verified paid consume, failed/cancelled release.
- Browser return không có stock effect; duplicate IPN không double effect.
- Internal restock idempotent đã có; Order cancellation/refund runtime chưa tồn tại nên không tạo trigger giả.
