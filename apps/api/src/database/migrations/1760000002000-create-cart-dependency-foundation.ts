import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartDependencyFoundation1760000002000 implements MigrationInterface {
  name = 'CreateCartDependencyFoundation1760000002000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`products\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`brand_id\` BIGINT UNSIGNED NULL, \`product_code\` VARCHAR(64) NOT NULL, \`product_name\` VARCHAR(255) NOT NULL,
      \`slug\` VARCHAR(191) NOT NULL, \`base_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      \`sellable_status\` VARCHAR(32) NOT NULL DEFAULT 'unavailable', \`product_visibility\` VARCHAR(32) NOT NULL DEFAULT 'hidden',
      \`product_status\` VARCHAR(32) NOT NULL DEFAULT 'draft', \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` DATETIME(3) NULL,
      \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`uq_products_tenant_code\` UNIQUE (\`tenant_id\`, \`product_code\`),
      CONSTRAINT \`uq_products_tenant_slug\` UNIQUE (\`tenant_id\`, \`slug\`),
      CONSTRAINT \`chk_products_price\` CHECK (\`base_price\` >= 0),
      CONSTRAINT \`chk_products_sellable\` CHECK (\`sellable_status\` IN ('sellable','out_of_stock','preorder','unavailable')),
      CONSTRAINT \`chk_products_visibility\` CHECK (\`product_visibility\` IN ('public','hidden','private')),
      CONSTRAINT \`chk_products_status\` CHECK (\`product_status\` IN ('draft','active','discontinued')),
      INDEX \`idx_products_tenant_status_visibility\` (\`tenant_id\`, \`product_status\`, \`product_visibility\`),
      INDEX \`idx_products_brand_status\` (\`brand_id\`, \`product_status\`), FULLTEXT INDEX \`ft_products_name\` (\`product_name\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`customer_profiles\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`user_account_id\` BIGINT UNSIGNED NULL, \`customer_code\` VARCHAR(64) NOT NULL, \`full_name\` VARCHAR(255) NOT NULL,
      \`contact_info\` JSON NULL, \`customer_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`consent_state\` VARCHAR(32) NOT NULL DEFAULT 'unknown', \`marketing_opt_in_status\` VARCHAR(32) NOT NULL DEFAULT 'not_opted_in',
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`uq_customer_profiles_tenant_code\` UNIQUE (\`tenant_id\`, \`customer_code\`),
      CONSTRAINT \`uq_customer_profiles_tenant_user\` UNIQUE (\`tenant_id\`, \`user_account_id\`),
      CONSTRAINT \`fk_customer_profiles_user_account\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_accounts\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`chk_customer_profiles_status\` CHECK (\`customer_status\` IN ('active','guest','blocked','archived')),
      INDEX \`idx_customer_profiles_status_created\` (\`tenant_id\`, \`customer_status\`, \`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`inventory_items\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`product_id\` BIGINT UNSIGNED NOT NULL, \`available_quantity\` INT UNSIGNED NOT NULL DEFAULT 0,
      \`reserved_quantity\` INT UNSIGNED NOT NULL DEFAULT 0, \`stock_threshold\` INT UNSIGNED NOT NULL DEFAULT 0,
      \`stock_status\` VARCHAR(32) NOT NULL DEFAULT 'available', \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`deleted_at\` DATETIME(3) NULL,
      \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`uq_inventory_items_tenant_product\` UNIQUE (\`tenant_id\`, \`product_id\`),
      CONSTRAINT \`fk_inventory_items_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`chk_inventory_quantities\` CHECK (\`available_quantity\` >= 0 AND \`reserved_quantity\` >= 0 AND \`stock_threshold\` >= 0),
      CONSTRAINT \`chk_inventory_status\` CHECK (\`stock_status\` IN ('available','low_stock','out_of_stock','disabled')),
      INDEX \`idx_inventory_status\` (\`tenant_id\`, \`stock_status\`), INDEX \`idx_inventory_product_status\` (\`product_id\`, \`stock_status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `inventory_items`');
    await queryRunner.query('DROP TABLE IF EXISTS `customer_profiles`');
    await queryRunner.query('DROP TABLE IF EXISTS `products`');
  }
}
