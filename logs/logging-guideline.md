# Logging Guideline / Hướng dẫn ghi log

## Application Logging / Log ứng dụng

- Ghi event quan trọng cho request, job và gateway.
- Không ghi dữ liệu nhạy cảm.
- Gắn correlation id khi có thể để truy vết request.

## Security Logging / Log bảo mật

- Ghi đăng nhập thất bại, token lỗi, truy cập bị từ chối và thay đổi quyền.
- Không ghi password hoặc token thô.
- Security log cần được bảo vệ quyền đọc.

## AI Interaction Logging / Log tương tác AI

- Ghi tên feature, thời điểm, trạng thái, provider, latency và chi phí ước tính nếu có.
- Không ghi prompt chứa dữ liệu cá nhân nếu không được ẩn.
- Ghi fallback khi provider lỗi hoặc output không đạt yêu cầu.

