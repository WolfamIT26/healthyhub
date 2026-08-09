import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderCreationFoundation1760000004000 implements MigrationInterface {
  name = 'CreateOrderCreationFoundation1760000004000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`orders\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`customer_profile_id\` BIGINT UNSIGNED NOT NULL, \`cart_id\` BIGINT UNSIGNED NULL, \`order_code\` VARCHAR(64) NOT NULL,
      \`order_source\` VARCHAR(32) NOT NULL DEFAULT 'web', \`order_status\` VARCHAR(32) NOT NULL DEFAULT 'new',
      \`payment_status_snapshot\` VARCHAR(32) NOT NULL DEFAULT 'pending', \`shipping_status_snapshot\` VARCHAR(32) NOT NULL DEFAULT 'pending',
      \`order_total\` DECIMAL(12,2) NOT NULL, \`idempotency_key_hash\` CHAR(64) NOT NULL, \`request_hash\` CHAR(64) NOT NULL,
      \`placed_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`completed_at\` DATETIME(3) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_orders_customer_profile\` FOREIGN KEY (\`customer_profile_id\`) REFERENCES \`customer_profiles\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`fk_orders_cart\` FOREIGN KEY (\`cart_id\`) REFERENCES \`carts\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_orders_tenant_code\` UNIQUE (\`tenant_id\`, \`order_code\`),
      CONSTRAINT \`uq_orders_tenant_customer_idempotency\` UNIQUE (\`tenant_id\`, \`customer_profile_id\`, \`idempotency_key_hash\`),
      CONSTRAINT \`chk_orders_total\` CHECK (\`order_total\` >= 0),
      CONSTRAINT \`chk_orders_status\` CHECK (\`order_status\` IN ('new')),
      CONSTRAINT \`chk_orders_payment_status\` CHECK (\`payment_status_snapshot\` IN ('pending')),
      CONSTRAINT \`chk_orders_shipping_status\` CHECK (\`shipping_status_snapshot\` IN ('pending')),
      INDEX \`idx_orders_customer_time\` (\`tenant_id\`, \`customer_profile_id\`, \`placed_at\`),
      INDEX \`idx_orders_status_time\` (\`tenant_id\`, \`order_status\`, \`placed_at\`),
      INDEX \`idx_orders_payment_shipping\` (\`tenant_id\`, \`payment_status_snapshot\`, \`shipping_status_snapshot\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`order_items\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`order_id\` BIGINT UNSIGNED NOT NULL, \`product_id\` BIGINT UNSIGNED NULL, \`product_name_snapshot\` VARCHAR(255) NOT NULL,
      \`sku_snapshot\` VARCHAR(64) NULL, \`unit_price_snapshot\` DECIMAL(12,2) NOT NULL, \`quantity\` INT UNSIGNED NOT NULL,
      \`line_total\` DECIMAL(12,2) NOT NULL, \`item_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_order_items_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`fk_order_items_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE SET NULL,
      CONSTRAINT \`chk_order_items_quantity\` CHECK (\`quantity\` > 0),
      CONSTRAINT \`chk_order_items_amounts\` CHECK (\`unit_price_snapshot\` >= 0 AND \`line_total\` >= 0),
      INDEX \`idx_order_items_order\` (\`tenant_id\`, \`order_id\`), INDEX \`idx_order_items_product\` (\`tenant_id\`, \`product_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`payments\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1, \`order_id\` BIGINT UNSIGNED NOT NULL,
      \`payment_method\` VARCHAR(64) NOT NULL DEFAULT 'cod', \`payment_amount\` DECIMAL(12,2) NOT NULL,
      \`payment_status\` VARCHAR(32) NOT NULL DEFAULT 'pending', \`paid_at\` DATETIME(3) NULL, \`provider_reference\` VARCHAR(191) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_payments_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_payments_tenant_order\` UNIQUE (\`tenant_id\`, \`order_id\`),
      CONSTRAINT \`chk_payments_amount\` CHECK (\`payment_amount\` >= 0),
      CONSTRAINT \`chk_payments_method\` CHECK (\`payment_method\` IN ('cod')),
      CONSTRAINT \`chk_payments_status\` CHECK (\`payment_status\` IN ('pending')),
      INDEX \`idx_payments_status_time\` (\`tenant_id\`, \`payment_status\`, \`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`shipments\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1, \`order_id\` BIGINT UNSIGNED NOT NULL,
      \`shipping_method\` VARCHAR(64) NOT NULL DEFAULT 'manual', \`shipping_fee\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      \`shipping_status\` VARCHAR(32) NOT NULL DEFAULT 'pending', \`tracking_reference\` VARCHAR(191) NULL,
      \`shipped_at\` DATETIME(3) NULL, \`delivered_at\` DATETIME(3) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_shipments_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_shipments_tenant_order\` UNIQUE (\`tenant_id\`, \`order_id\`),
      CONSTRAINT \`chk_shipments_fee\` CHECK (\`shipping_fee\` >= 0),
      CONSTRAINT \`chk_shipments_method\` CHECK (\`shipping_method\` IN ('manual')),
      CONSTRAINT \`chk_shipments_status\` CHECK (\`shipping_status\` IN ('pending')),
      INDEX \`idx_shipments_status_time\` (\`tenant_id\`, \`shipping_status\`, \`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE \`shipping_addresses\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1, \`shipment_id\` BIGINT UNSIGNED NOT NULL,
      \`customer_address_id\` BIGINT UNSIGNED NULL, \`recipient_name\` VARCHAR(255) NOT NULL, \`recipient_phone\` VARCHAR(32) NOT NULL,
      \`address_text\` TEXT NOT NULL, \`delivery_note\` VARCHAR(500) NULL, \`address_snapshot_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_shipping_addresses_shipment\` FOREIGN KEY (\`shipment_id\`) REFERENCES \`shipments\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_shipping_addresses_tenant_shipment_status\` UNIQUE (\`tenant_id\`, \`shipment_id\`, \`address_snapshot_status\`),
      CONSTRAINT \`chk_shipping_addresses_status\` CHECK (\`address_snapshot_status\` IN ('active'))
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['shipping_addresses', 'shipments', 'payments', 'order_items', 'orders']) {
      await queryRunner.query(`DROP TABLE IF EXISTS \`${table}\``);
    }
  }
}
