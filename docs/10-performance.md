# Performance / Hiệu năng

## Database / Cơ sở dữ liệu

- Thiết kế index cho cột dùng để filter, sort và join.
- Tối ưu query trước khi cache.
- Không trả danh sách lớn nếu không có pagination.
- Theo dõi query chậm khi triển khai production.

## API / Backend

- Response chỉ trả dữ liệu cần thiết.
- Áp dụng pagination cho danh sách.
- Dùng cache cho dữ liệu ít thay đổi.
- Tách tác vụ chậm thành background job khi cần.

## Frontend / Giao diện

- Tối ưu bundle.
- Lazy load route hoặc component nặng khi cần.
- Tối ưu hình ảnh sản phẩm.
- Tránh render lại không cần thiết.

## AI / Trí tuệ nhân tạo

- Cache kết quả AI phù hợp.
- Giới hạn token, thời gian xử lý và retry.
- Không gọi AI cho tác vụ có thể xử lý bằng rule đơn giản.

