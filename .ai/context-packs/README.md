# AI Context Packs / Gói ngữ cảnh AI

## Purpose / Mục tiêu

Context Pack giúp AI Agent đọc đúng phần cần thiết theo từng module để tối ưu token.

## Rule / Quy tắc

- Mỗi module có một context pack riêng.
- Context pack chỉ trỏ đến tài liệu cần đọc, không lặp lại toàn bộ nội dung dài.
- Khi module thay đổi lớn, cập nhật context pack liên quan.

## Groups / Nhóm context pack

- [modules](modules/README.md): context pack theo module nghiệp vụ.
- [core](core/README.md): context pack cho AI Core, architecture review, security review, documentation, prompt engineering và release.
