# Customer API / API Customer

| Method | Endpoint | Kết quả |
| --- | --- | --- |
| GET | `/api/v1/me/profile` | Profile owner-scoped, email read-only |
| PATCH | `/api/v1/me/profile` | Cập nhật fullName/phone |
| GET | `/api/v1/me/addresses` | Active addresses, default trước |
| POST | `/api/v1/me/addresses` | Tạo địa chỉ, create dedupe |
| PATCH | `/api/v1/me/addresses/{addressId}` | Sửa/đặt default nếu thuộc owner |
| DELETE | `/api/v1/me/addresses/{addressId}` | Xóa mềm idempotent |

Mutation yêu cầu `X-Idempotency-Key`. Response không chứa customerProfileId, auth identity ID, audit fields, raw key/hash hoặc dữ liệu provider.
