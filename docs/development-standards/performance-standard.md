# Performance Standard / Chuẩn hiệu năng

## Purpose / Mục tiêu

Performance Standard giúp HealthyHub phản hồi nhanh trong luồng mua hàng, admin vận hành và AI interaction mà không tối ưu sớm quá mức.

## Backend Database / Backend và database

- Danh sách lớn phải có pagination.
- Tránh N+1 query.
- Chỉ chọn field cần thiết cho list API.
- Index bám Physical Database Design.
- Theo dõi query chậm và API chậm ở phase monitoring.
- Transaction phải đủ ngắn và tránh giữ lock không cần thiết.

## Frontend / Frontend

- Debounce tìm kiếm khi gọi API theo keyword.
- Không gọi API lặp không cần thiết khi state không đổi.
- Lazy loading và code splitting cho route/module nặng khi cần.
- Tối ưu ảnh sản phẩm và banner.
- Skeleton giữ layout ổn định, tránh nhảy layout.

## Gateway External Service / Gateway và dịch vụ ngoài

- Mọi external service phải có timeout.
- Retry có giới hạn và không nhân đôi side effect.
- Payment/webhook cần idempotency.
- AI feature cần timeout và fallback.

## Cache Rule / Quy tắc cache

- Chỉ cache khi có nhu cầu thực tế và biết invalidation.
- Cache product/category/settings public có thể hữu ích.
- Không cache dữ liệu nhạy cảm nếu chưa có policy.
- Cache không được làm sai tồn kho, giá, đơn hàng hoặc permission.

## Performance Review / Review hiệu năng

Module chưa đạt nếu list lớn không phân trang, query có nguy cơ N+1, ảnh không có strategy tối ưu, hoặc external service không có timeout.

