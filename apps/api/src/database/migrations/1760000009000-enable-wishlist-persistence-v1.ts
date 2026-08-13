import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableWishlistPersistenceV11760000009000 implements MigrationInterface {
  name = 'EnableWishlistPersistenceV11760000009000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`wishlists\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`customer_profile_id\` BIGINT UNSIGNED NOT NULL,
      \`wishlist_name\` VARCHAR(150) NOT NULL DEFAULT 'Default',
      \`wishlist_visibility\` VARCHAR(32) NOT NULL DEFAULT 'private',
      \`wishlist_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL,
      \`created_by\` BIGINT UNSIGNED NULL,
      \`updated_by\` BIGINT UNSIGNED NULL,
      \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_wishlists_customer_profile\` FOREIGN KEY (\`customer_profile_id\`)
        REFERENCES \`customer_profiles\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_wishlists_tenant_customer_name\` UNIQUE (
        \`tenant_id\`, \`customer_profile_id\`, \`wishlist_name\`
      ),
      CONSTRAINT \`chk_wishlists_visibility\` CHECK (\`wishlist_visibility\` = 'private'),
      CONSTRAINT \`chk_wishlists_status\` CHECK (\`wishlist_status\` IN ('active', 'archived')),
      INDEX \`idx_wishlists_customer_status\` (
        \`tenant_id\`, \`customer_profile_id\`, \`wishlist_status\`
      )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`wishlist_items\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`wishlist_id\` BIGINT UNSIGNED NOT NULL,
      \`product_id\` BIGINT UNSIGNED NOT NULL,
      \`saved_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`wishlist_item_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`note\` VARCHAR(500) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL,
      \`created_by\` BIGINT UNSIGNED NULL,
      \`updated_by\` BIGINT UNSIGNED NULL,
      \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_wishlist_items_wishlist\` FOREIGN KEY (\`wishlist_id\`)
        REFERENCES \`wishlists\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`fk_wishlist_items_product\` FOREIGN KEY (\`product_id\`)
        REFERENCES \`products\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_wishlist_items_tenant_wishlist_product_status\` UNIQUE (
        \`tenant_id\`, \`wishlist_id\`, \`product_id\`, \`wishlist_item_status\`
      ),
      CONSTRAINT \`chk_wishlist_items_status\` CHECK (
        \`wishlist_item_status\` IN ('active', 'removed', 'unavailable')
      ),
      INDEX \`idx_wishlist_items_wishlist\` (
        \`tenant_id\`, \`wishlist_id\`, \`wishlist_item_status\`, \`saved_at\`
      ),
      INDEX \`idx_wishlist_items_product\` (\`tenant_id\`, \`product_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `wishlist_items`');
    await queryRunner.query('DROP TABLE IF EXISTS `wishlists`');
  }
}
