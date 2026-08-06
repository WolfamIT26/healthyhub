# Review Workflow / Quy trình review

## When to Use / Khi sử dụng

Dùng khi nhiệm vụ yêu cầu đánh giá, kiểm tra, nhận xét hoặc audit nhẹ mà không tạo thay đổi.

## Required Reading / Tài liệu cần đọc

- Tài liệu hoặc file được yêu cầu review.
- Rule liên quan trong `.ai/rules`.
- Reviewer profile liên quan trong `.ai/reviewers`.
- Foundation docs liên quan đến phạm vi review.

## Steps / Các bước

1. Xác định tiêu chí review.
2. Đọc file liên quan và ghi nhận bằng chứng.
3. Phân loại finding theo mức độ nghiêm trọng.
4. Nêu rủi ro, lý do và vị trí tài liệu nếu có.
5. Không sửa file nếu prompt chỉ yêu cầu review.

## Output Rule / Quy tắc đầu ra

Finding phải cụ thể, có căn cứ và ưu tiên lỗi có tác động thật: bảo mật, sai kiến trúc, thiếu tài liệu, thiếu test hoặc vượt phạm vi.

