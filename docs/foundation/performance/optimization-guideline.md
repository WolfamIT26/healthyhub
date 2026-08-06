# Optimization Guideline / Hướng dẫn tối ưu

## Backend Optimization / Tối ưu backend

- Tránh xử lý nặng trong request đồng bộ nếu có thể đưa sang job hoặc queue ở phase sau.
- Chỉ trả field client cần.
- Dùng pagination cho danh sách.
- Chuẩn hóa error response để client xử lý nhanh.
- Đặt timeout cho gateway call.

## Frontend Optimization / Tối ưu frontend

- Chia route và bundle hợp lý khi ứng dụng lớn.
- Tối ưu ảnh, font và asset.
- Tránh render lại không cần thiết ở component phức tạp.
- Dữ liệu danh sách phải có loading, empty và error state rõ.

## AI Optimization / Tối ưu AI

- Dùng context pack nhỏ theo module.
- Không gửi toàn bộ tài liệu khi chỉ cần một phần.
- Cache kết quả AI phù hợp nếu output ổn định và không chứa dữ liệu nhạy cảm.
- Có timeout và fallback message cho user.

## Related / Liên quan

- [Context Pack Guide / Hướng dẫn context pack](../ai/context-pack-guide.md)
- [Cache Guideline / Hướng dẫn cache](cache-guideline.md)

