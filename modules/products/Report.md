# Product Commerce Authority Report

**Status: READY for Cart consumption.**

Minimum Product persistence dùng BIGINT identifier, `base_price` authoritative, lifecycle/visibility/sellable status và VND currency. `ProductCommerceReader` cung cấp Product snapshot hoặc `null`; không dùng frontend catalog/mock làm fallback.

Không triển khai Admin CRUD, public Product API, promotion, review hoặc Product UI trong Prompt 25.6.
