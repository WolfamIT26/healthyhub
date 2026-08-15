# Category Database / Cơ sở dữ liệu Category

`categories`, `category_display_rules` and `product_category_links` implement the approved physical contract. FK relations restrict destructive removal; status/soft delete preserve links. Unique primary enforcement prevents duplicate Product rows in Catalog.
