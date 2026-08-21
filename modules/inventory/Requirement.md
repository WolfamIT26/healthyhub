# Inventory Requirement / Yêu cầu Inventory

## Acceptance Criteria / Tiêu chí hoàn thành

- [x] Quantity không âm bằng MySQL unsigned/check constraint.
- [x] Product reference dùng FK `RESTRICT` và uniqueness theo tenant/Product.
- [x] Missing/deleted/disabled Inventory trả unavailable, không có fallback giả.
- [x] Zero quantity luôn trả out-of-stock dù trạng thái lưu bị trễ.
- [x] Product public không expose quantity nội bộ.
- [x] Cart add/update không tin stock hoặc quantity khả dụng từ client.
- [x] Order create revalidate stock hiện tại.
- [x] Order create reserve atomically; COD/VNPAY lifecycle có exact consume/release rules.
- [x] Duplicate event/mutation idempotent; concurrent Orders không oversell hoặc làm stock âm.

## Edge Cases / Trường hợp biên

- Product không tồn tại hoặc không còn sellable.
- Inventory row thiếu, soft-deleted hoặc disabled.
- Quantity bằng 0, âm, không nguyên hoặc vượt stock.
- Hai request tạo Order đồng thời khi stock thấp; row lock chỉ cho số Order phù hợp stock commit.
- Late VNPAY paid sau failed chỉ reacquire khi còn stock; thiếu stock rollback để reconciliation.
