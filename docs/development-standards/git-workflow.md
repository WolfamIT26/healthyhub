# Git Workflow / Quy trình Git

## Purpose / Mục tiêu

Git Workflow giúp thay đổi nhỏ, dễ review, không trộn nhiều mục đích và luôn cập nhật tài liệu liên quan.

## Workflow / Quy trình

1. Đọc context/specification liên quan.
2. Tạo hoặc chọn branch đúng naming.
3. Thực hiện thay đổi nhỏ theo một mục tiêu.
4. Chạy validation, lint, test và build phù hợp.
5. Tự review diff.
6. Cập nhật tài liệu, status, report, checklist và changelog.
7. Tạo pull request với checklist rõ.

## Commit Rule / Quy tắc commit

- Commit nhỏ theo một mục đích.
- Không trộn refactor lớn với feature.
- Không commit secret, log thật, build output hoặc dependency folder.
- Commit message bám Commit Convention.

## Pull Request Rule / Quy tắc pull request

PR phải nêu mục tiêu, file chính thay đổi, test đã chạy, rủi ro và tài liệu đã cập nhật. Không merge nếu còn lỗi Critical/High chưa xử lý.

