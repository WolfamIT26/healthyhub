# Product Database / Cơ sở dữ liệu Product

Prompt 31 enables executable `brands`, `categories`, `category_display_rules`, `product_category_links`, `product_contents`, `product_ingredients`, `product_dietary_tags`, `product_nutrition_facts`, `media_assets` and `product_media_links`, while extending existing `products` with `is_featured` and its Brand FK.

Unique constraints protect Product code/slug, content status, dietary tags, nutrition row and media link. A generated unique key permits at most one active primary Category per Product. Product/Category/Brand/Media relations use `RESTRICT`; lifecycle/soft delete preserves historic commerce references.

Development seed enriches the existing 24 Product/Inventory fixtures with deterministic Category, Brand, Content, dietary and selected nutrition/ingredient data. It is not a production fallback.

Prompt 35 does not add a migration. Admin Product management reuses the same tables Public Product reads from. Product identity stays `(tenant_id, product_code)` and `(tenant_id, slug)`, Product row `version` protects stale admin edits, and child table unique constraints protect duplicate dietary/nutrition/media/category records.

Soft delete applies to the Product row only. Historical Order snapshots, Review rows, Inventory rows, Category links and Media assets are not cascaded or hard-deleted by Admin Product V1.
