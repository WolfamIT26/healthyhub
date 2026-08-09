import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartPersistence1760000003000 implements MigrationInterface {
  name = 'CreateCartPersistence1760000003000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`carts\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`customer_profile_id\` BIGINT UNSIGNED NOT NULL, \`cart_owner_type\` VARCHAR(32) NOT NULL DEFAULT 'customer',
      \`guest_session_reference\` VARCHAR(191) NULL, \`cart_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`cart_validation_status\` VARCHAR(32) NOT NULL DEFAULT 'not_validated', \`last_validated_at\` DATETIME(3) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_carts_customer_profile\` FOREIGN KEY (\`customer_profile_id\`) REFERENCES \`customer_profiles\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_carts_tenant_customer_status\` UNIQUE (\`tenant_id\`, \`customer_profile_id\`, \`cart_status\`),
      CONSTRAINT \`chk_carts_owner\` CHECK (\`cart_owner_type\` IN ('customer')),
      CONSTRAINT \`chk_carts_status\` CHECK (\`cart_status\` IN ('active','checked_out','abandoned','expired')),
      CONSTRAINT \`chk_carts_validation\` CHECK (\`cart_validation_status\` IN ('valid','invalid','not_validated')),
      INDEX \`idx_carts_customer_status\` (\`tenant_id\`, \`customer_profile_id\`, \`cart_status\`),
      INDEX \`idx_carts_status_updated\` (\`tenant_id\`, \`cart_status\`, \`updated_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`cart_items\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`cart_id\` BIGINT UNSIGNED NOT NULL, \`product_id\` BIGINT UNSIGNED NOT NULL, \`quantity\` INT UNSIGNED NOT NULL DEFAULT 1,
      \`item_price_snapshot\` DECIMAL(12,2) NULL, \`item_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`added_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` DATETIME(3) NULL,
      \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_cart_items_cart\` FOREIGN KEY (\`cart_id\`) REFERENCES \`carts\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`fk_cart_items_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_cart_items_tenant_cart_product_status\` UNIQUE (\`tenant_id\`, \`cart_id\`, \`product_id\`, \`item_status\`),
      CONSTRAINT \`chk_cart_items_quantity\` CHECK (\`quantity\` > 0),
      CONSTRAINT \`chk_cart_items_price\` CHECK (\`item_price_snapshot\` IS NULL OR \`item_price_snapshot\` >= 0),
      CONSTRAINT \`chk_cart_items_status\` CHECK (\`item_status\` IN ('active','unavailable','removed')),
      INDEX \`idx_cart_items_cart\` (\`tenant_id\`, \`cart_id\`, \`item_status\`),
      INDEX \`idx_cart_items_product\` (\`tenant_id\`, \`product_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `cart_items`');
    await queryRunner.query('DROP TABLE IF EXISTS `carts`');
  }
}
