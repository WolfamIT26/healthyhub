# Prompt 04 AI Development Core / Tổng hợp AI Development Core

## Task / Nhiệm vụ

Xây dựng AI Development Core cho AI Development OS trong thư mục `.ai`.

## Summary / Tóm tắt

Đã mở rộng `.ai` thành hệ thống core đầy đủ cho AI Agent: skills, rules, prompts, templates, context-packs, personas, workflows, checklists, validators, reviewers, registry, knowledge, memory và agents.

## Added / Đã thêm

- `.ai/workflows`
- `.ai/checklists`
- `.ai/validators`
- `.ai/reviewers`
- `.ai/registry`
- `.ai/knowledge`
- `.ai/agents`
- `.ai/skills/roles`
- `.ai/prompts/framework`
- `.ai/context-packs/core`
- `.ai/templates/framework`
- `.ai/Status.md`
- `.ai/Report.md`
- `.ai/Checklist.md`
- `.ai/ChangeLog.md`

## Updated / Đã cập nhật

- `.ai/README.md`
- `.ai/rules/README.md`
- `.ai/skills/README.md`
- `.ai/prompts/README.md`
- `.ai/context-packs/README.md`
- `.ai/personas/README.md`
- `.ai/memory/README.md`
- `.ai/templates/README.md`
- `docs/01-folder-structure.md`
- `CAU_TRUC_THU_MUC.md`
- `CHANGELOG.md`

## Not Changed / Không thay đổi

- Không tạo code nghiệp vụ.
- Không tạo frontend.
- Không tạo backend.
- Không tạo database.
- Không tạo API.
- Không tạo giao diện.
- Không thay đổi technology stack.

## Verification / Kiểm tra

- Đã chạy `git diff --check`, kết quả sạch.
- Đã chạy `find .ai -maxdepth 2 -type d | sort` để xác nhận các folder AI Core.
- Đã chạy `rg --files .ai | wc -l`, `.ai` hiện có 232 file.

## Notes / Ghi chú

Các prompt sau nên bắt đầu từ `.ai/registry/README.md` để chọn đúng agent, skill, workflow và context pack.
