# Logging Standard / Chuẩn logging

## Purpose / Mục tiêu

Logging hỗ trợ debug, audit, security monitoring và AI quality review nhưng không được làm lộ dữ liệu nhạy cảm.

## Log Categories / Nhóm log

| Category / Nhóm | Usage / Cách dùng |
| --- | --- |
| Application | Request lifecycle, use case quan trọng, job status. |
| Error | Exception, gateway failure, database error đã ẩn dữ liệu nhạy cảm. |
| Security | Auth failure, permission denied, suspicious activity. |
| Audit | Admin action, role change, order status change, inventory adjustment. |
| AI | Prompt metadata, model/provider status, source, confidence, safety, không log secret/raw PII. |

## Required Metadata / Metadata bắt buộc

- Timestamp.
- Environment.
- Service/app name.
- Request ID hoặc trace ID.
- User ID nếu có và được phép.
- Module/domain.
- Action.
- Result hoặc error code.

## Sensitive Data Rule / Quy tắc dữ liệu nhạy cảm

- Không log password, refresh token, access token, credential, secret, raw payment data.
- Mask email, phone, address khi không cần toàn bộ dữ liệu.
- Không log prompt chứa dữ liệu cá nhân nếu chưa có policy.
- Log AI phải lưu metadata đủ audit, không lưu toàn bộ nội dung nhạy cảm.

## Operational Rule / Quy tắc vận hành

- Lỗi Critical/High phải có alert hoặc report theo monitoring phase.
- Log phải có retention policy khi triển khai production.
- Không dùng console log tùy tiện ở production code.

