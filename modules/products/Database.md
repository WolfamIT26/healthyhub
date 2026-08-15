# Product Database / Cơ sở dữ liệu Product

Prompt 31 enables executable `brands`, `categories`, `category_display_rules`, `product_category_links`, `product_contents`, `product_ingredients`, `product_dietary_tags`, `product_nutrition_facts`, `media_assets` and `product_media_links`, while extending existing `products` with `is_featured` and its Brand FK.

Unique constraints protect Product code/slug, content status, dietary tags, nutrition row and media link. A generated unique key permits at most one active primary Category per Product. Product/Category/Brand/Media relations use `RESTRICT`; lifecycle/soft delete preserves historic commerce references.

Development seed enriches the existing 24 Product/Inventory fixtures with deterministic Category, Brand, Content, dietary and selected nutrition/ingredient data. It is not a production fallback.
