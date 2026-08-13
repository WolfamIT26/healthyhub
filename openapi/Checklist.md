# OpenAPI Checklist / Checklist OpenAPI

- [x] Tạo thư mục `openapi/`.
- [x] Tạo OpenAPI 3.1 root file.
- [x] Khai báo 23 domain tag.
- [x] Sinh 196 endpoint operation từ API Specification.
- [x] Khai báo Bearer JWT, Refresh Token, API Key, Webhook Signature.
- [x] Khai báo response chuẩn 200, 201, 202, 204, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503.
- [x] Khai báo schema dùng chung cho envelope, error, pagination, upload, AI, money, address, audit metadata.
- [x] Khai báo webhook payment, shipping, notification.
- [x] Thêm example an toàn, không chứa secret thật.
- [x] Parse YAML cho toàn bộ file OpenAPI.
- [x] Kiểm tra `$ref` local/external quan trọng.
- [x] Kiểm tra `operationId` không trùng.
- [x] Đối chiếu số operation với `.spec/api/domains`.
- [x] Mô tả đầy đủ signed VNPAY Return/IPN query parameters và callback authority.
- [x] Typed Customer Profile/Address requests, safe responses và exact self-read parameters.
- [ ] Sinh DTO schema chi tiết theo từng domain ở phase sau.
- [ ] Chạy semantic OpenAPI validator chuyên dụng khi dự án có công cụ phù hợp.
