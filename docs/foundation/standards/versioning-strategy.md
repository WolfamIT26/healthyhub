# Versioning Strategy / Chiến lược version

## Principle / Nguyên tắc

HealthyHub dùng Semantic Versioning khi bắt đầu release sản phẩm: `MAJOR.MINOR.PATCH`.

## Version Meaning / Ý nghĩa version

- `MAJOR`: thay đổi phá vỡ tương thích hoặc thay đổi kiến trúc lớn.
- `MINOR`: thêm tính năng tương thích ngược.
- `PATCH`: sửa lỗi, cập nhật tài liệu hoặc cải thiện nhỏ không phá vỡ hành vi.

## Framework Version / Version framework

AI Development OS có thể có version riêng với sản phẩm. Khi framework thay đổi rule, workflow, template hoặc structure quan trọng, phải cập nhật changelog và inventory.

## Release Tag / Tag release

Tag nên dùng dạng `v1.0.0`. Nếu là framework release, có thể dùng tiền tố rõ nghĩa như `framework-v1.0.0` khi cần phân biệt với product release.

## Related / Liên quan

- [Release Strategy / Chiến lược release](release-strategy.md)
- [ADR Guide / Hướng dẫn ADR](../decision-record/adr-guide.md)

