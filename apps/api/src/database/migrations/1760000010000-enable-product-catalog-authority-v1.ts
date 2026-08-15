import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableProductCatalogAuthorityV11760000010000 implements MigrationInterface {
  name = 'EnableProductCatalogAuthorityV11760000010000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE brands (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      brand_name VARCHAR(255) NOT NULL, brand_slug VARCHAR(191) NOT NULL,
      brand_origin VARCHAR(150) NULL, brand_status VARCHAR(32) NOT NULL DEFAULT 'active',
      description TEXT NULL, created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT uq_brands_tenant_slug UNIQUE (tenant_id, brand_slug),
      CONSTRAINT uq_brands_tenant_name UNIQUE (tenant_id, brand_name),
      CONSTRAINT chk_brands_status CHECK (brand_status IN ('active','hidden','archived')),
      INDEX idx_brands_status (tenant_id, brand_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE categories (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      category_name VARCHAR(255) NOT NULL, slug VARCHAR(191) NOT NULL, description VARCHAR(500) NULL,
      parent_category_id BIGINT UNSIGNED NULL, category_status VARCHAR(32) NOT NULL DEFAULT 'active',
      category_visibility VARCHAR(32) NOT NULL DEFAULT 'public',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_categories_parent FOREIGN KEY (parent_category_id) REFERENCES categories (id) ON DELETE RESTRICT,
      CONSTRAINT uq_categories_tenant_slug UNIQUE (tenant_id, slug),
      CONSTRAINT chk_categories_status CHECK (category_status IN ('active','hidden','archived')),
      CONSTRAINT chk_categories_visibility CHECK (category_visibility IN ('public','private')),
      INDEX idx_categories_parent (tenant_id, parent_category_id),
      INDEX idx_categories_visibility_status (tenant_id, category_visibility, category_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`ALTER TABLE products
      ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER product_status,
      ADD CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE RESTRICT,
      ADD INDEX idx_products_public_featured (tenant_id, product_status, product_visibility, is_featured)
    `);
    await queryRunner.query(`CREATE TABLE product_category_links (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      product_id BIGINT UNSIGNED NOT NULL, category_id BIGINT UNSIGNED NOT NULL,
      is_primary TINYINT(1) NOT NULL DEFAULT 0, link_status VARCHAR(32) NOT NULL DEFAULT 'active',
      linked_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_product_category_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT fk_product_category_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT,
      CONSTRAINT uq_product_category_tenant_product_category UNIQUE (tenant_id, product_id, category_id),
      CONSTRAINT chk_product_category_status CHECK (link_status IN ('active','inactive')),
      INDEX idx_product_category_product (tenant_id, product_id, link_status),
      INDEX idx_product_category_category (tenant_id, category_id, link_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE product_contents (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      product_id BIGINT UNSIGNED NOT NULL, description TEXT NOT NULL, summary VARCHAR(500) NULL,
      usage_note TEXT NULL, storage_note TEXT NULL, seo_title VARCHAR(255) NULL,
      seo_description VARCHAR(500) NULL, content_status VARCHAR(32) NOT NULL DEFAULT 'draft',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_product_contents_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT uq_product_contents_tenant_product_status UNIQUE (tenant_id, product_id, content_status),
      CONSTRAINT chk_product_contents_status CHECK (content_status IN ('draft','review','published')),
      INDEX idx_product_contents_product_status (tenant_id, product_id, content_status),
      FULLTEXT INDEX ft_product_contents_text (description, summary)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE product_ingredients (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      product_id BIGINT UNSIGNED NOT NULL, ingredient_name VARCHAR(255) NOT NULL,
      ingredient_description TEXT NULL, nutrition_note TEXT NULL, allergy_warning VARCHAR(500) NULL,
      display_order INT UNSIGNED NOT NULL DEFAULT 0, created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_product_ingredients_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT uq_product_ingredients_tenant_product_name UNIQUE (tenant_id, product_id, ingredient_name),
      INDEX idx_product_ingredients_product_order (tenant_id, product_id, display_order),
      FULLTEXT INDEX ft_product_ingredients_name (ingredient_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE product_dietary_tags (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      product_id BIGINT UNSIGNED NOT NULL, dietary_tag VARCHAR(32) NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_product_dietary_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT uq_product_dietary_tenant_product_tag UNIQUE (tenant_id, product_id, dietary_tag),
      CONSTRAINT chk_product_dietary_tag CHECK (dietary_tag IN ('low-sugar','sugar-free','high-protein','vegan','vegetarian','lactose-free','gluten-free','organic')),
      INDEX idx_product_dietary_tag_product (tenant_id, dietary_tag, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE product_nutrition_facts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      product_id BIGINT UNSIGNED NOT NULL, serving_size VARCHAR(100) NULL, calories VARCHAR(100) NULL,
      protein VARCHAR(100) NULL, carbohydrates VARCHAR(100) NULL, fat VARCHAR(100) NULL,
      sugar VARCHAR(100) NULL, note VARCHAR(500) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_product_nutrition_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT uq_product_nutrition_tenant_product UNIQUE (tenant_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE media_assets (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      media_name VARCHAR(255) NOT NULL, media_type VARCHAR(32) NOT NULL,
      media_purpose VARCHAR(64) NOT NULL, storage_reference VARCHAR(500) NOT NULL,
      media_visibility VARCHAR(32) NOT NULL DEFAULT 'private', media_status VARCHAR(32) NOT NULL DEFAULT 'uploaded',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT chk_media_visibility CHECK (media_visibility IN ('public','private','restricted')),
      CONSTRAINT chk_media_status CHECK (media_status IN ('uploaded','active','hidden','archived','failed')),
      INDEX idx_media_assets_status_type (tenant_id, media_status, media_type),
      INDEX idx_media_assets_purpose_visibility (tenant_id, media_purpose, media_visibility, media_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE product_media_links (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      product_id BIGINT UNSIGNED NOT NULL, media_asset_id BIGINT UNSIGNED NOT NULL,
      media_role VARCHAR(64) NOT NULL DEFAULT 'gallery', display_order INT UNSIGNED NOT NULL DEFAULT 0,
      link_status VARCHAR(32) NOT NULL DEFAULT 'active', created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_product_media_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT fk_product_media_asset FOREIGN KEY (media_asset_id) REFERENCES media_assets (id) ON DELETE RESTRICT,
      CONSTRAINT uq_product_media_tenant_product_media_role UNIQUE (tenant_id, product_id, media_asset_id, media_role),
      CONSTRAINT chk_product_media_status CHECK (link_status IN ('active','inactive')),
      INDEX idx_product_media_product_role (tenant_id, product_id, media_role, display_order),
      INDEX idx_product_media_media (tenant_id, media_asset_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS product_media_links');
    await queryRunner.query('DROP TABLE IF EXISTS media_assets');
    await queryRunner.query('DROP TABLE IF EXISTS product_nutrition_facts');
    await queryRunner.query('DROP TABLE IF EXISTS product_dietary_tags');
    await queryRunner.query('DROP TABLE IF EXISTS product_ingredients');
    await queryRunner.query('DROP TABLE IF EXISTS product_contents');
    await queryRunner.query('DROP TABLE IF EXISTS product_category_links');
    await queryRunner.query('ALTER TABLE products DROP FOREIGN KEY fk_products_brand');
    await queryRunner.query('ALTER TABLE products DROP INDEX idx_products_public_featured');
    await queryRunner.query('ALTER TABLE products DROP COLUMN is_featured');
    await queryRunner.query('DROP TABLE IF EXISTS categories');
    await queryRunner.query('DROP TABLE IF EXISTS brands');
  }
}
