# Restore Guideline / Hướng dẫn khôi phục

## Before Restore / Trước khi khôi phục

- Xác định môi trường cần restore.
- Xác định bản backup.
- Kiểm tra quyền truy cập.
- Thông báo team nếu ảnh hưởng dữ liệu dùng chung.

## Restore Steps / Các bước khôi phục

1. Tạo bản sao hiện trạng trước khi restore nếu có thể.
2. Restore database.
3. Restore file upload.
4. Kiểm tra migration compatibility.
5. Kiểm tra API, đăng nhập, sản phẩm, đơn hàng và AI feature liên quan.

## After Restore / Sau khi khôi phục

Ghi lại thời gian, người thực hiện, nguồn backup và kết quả kiểm tra.

## Disaster Recovery Mapping / Mapping khôi phục thảm họa

Khi sự cố vượt quá restore thông thường, dùng thêm `disaster-recovery.md` để xác định quy trình phản ứng, kiểm tra sau restore và báo cáo sau sự cố.
