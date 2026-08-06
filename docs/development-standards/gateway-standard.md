# Gateway Standard / Chuẩn Gateway

## Purpose / Mục tiêu

Gateway Standard quy định cách tích hợp dịch vụ bên ngoài trong HealthyHub. Gateway là lớp chống phụ thuộc trực tiếp vào provider và giúp Modular Monolith có thể tách service trong tương lai.

## Gateway Scope / Phạm vi gateway

| Gateway / Gateway | Purpose / Mục tiêu |
| --- | --- |
| AI Gateway | Gọi AI provider, quản lý prompt/context/output/safety. |
| Payment Gateway | Tích hợp provider thanh toán và webhook. |
| Storage Gateway | Lưu file, ảnh sản phẩm, chứng nhận và tài liệu upload. |
| Notification Gateway | Gửi email, push, SMS, Zalo hoặc in-app notification. |
| OCR Gateway | Đọc chữ từ ảnh/tài liệu. |
| Vision Gateway | Nhận diện ảnh sản phẩm, QR hoặc food image. |
| Analytics Gateway | Gửi/nhận dữ liệu analytics hoặc event tracking. |
| Integration Gateway | Kết nối hệ thống ngoài như CRM, supplier hoặc shipping/payment provider phụ. |

## Contract Rule / Quy tắc contract

- Business module chỉ phụ thuộc gateway interface/contract, không phụ thuộc provider SDK.
- Adapter provider phải nằm sau gateway abstraction.
- Request/response gateway cần được map sang domain/data contract trước khi trả về business layer.
- Provider-specific error không được rò rỉ thẳng ra API response.

## Reliability Rule / Quy tắc độ tin cậy

- Mọi gateway call phải có timeout.
- Retry có giới hạn và chỉ dùng khi an toàn.
- Idempotency bắt buộc với payment webhook, notification send và action có thể bị gửi lại.
- Fallback được dùng khi không làm sai nghiệp vụ, ví dụ AI fallback sang search thường hoặc thông báo thiếu dữ liệu.

## Security Logging Rule / Quy tắc bảo mật và logging

- Không log secret, token, credential, payment raw data hoặc dữ liệu nhạy cảm.
- Log gateway phải có provider, action, result, error code, duration và trace/request id.
- AI gateway log chỉ lưu metadata an toàn nếu prompt có dữ liệu nhạy cảm.
- Upload gateway phải validate type, size, extension và path.

## Provider Change Rule / Quy tắc đổi provider

Đổi provider không được làm thay đổi business module nếu gateway contract không đổi. Nếu cần đổi contract, phải cập nhật specification, decision record, testing plan và changelog.

