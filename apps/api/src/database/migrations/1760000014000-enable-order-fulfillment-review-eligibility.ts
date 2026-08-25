import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableOrderFulfillmentReviewEligibility1760000014000 implements MigrationInterface {
  name = 'EnableOrderFulfillmentReviewEligibility1760000014000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_status_v2`');
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_shipping_status`');
    await queryRunner.query('ALTER TABLE `shipments` DROP CHECK `chk_shipments_status`');
    await queryRunner.query(
      "ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_status_v3` CHECK (`order_status` IN ('new','confirmed','completed','cancelled','returned'))",
    );
    await queryRunner.query(
      "ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_shipping_status_v2` CHECK (`shipping_status_snapshot` IN ('pending','shipped','delivered','cancelled','returned'))",
    );
    await queryRunner.query(
      "ALTER TABLE `shipments` ADD CONSTRAINT `chk_shipments_status_v2` CHECK (`shipping_status` IN ('pending','shipped','delivered','cancelled','returned'))",
    );
    await queryRunner.query(`CREATE TABLE order_status_histories (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      order_id BIGINT UNSIGNED NOT NULL,
      from_status VARCHAR(32) NULL,
      to_status VARCHAR(32) NOT NULL,
      reason VARCHAR(500) NULL,
      changed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      changed_by BIGINT UNSIGNED NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL,
      created_by BIGINT UNSIGNED NULL,
      updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL,
      version INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (id),
      CONSTRAINT fk_order_status_histories_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
      CONSTRAINT fk_order_status_histories_actor FOREIGN KEY (changed_by) REFERENCES user_accounts (id) ON DELETE SET NULL,
      CONSTRAINT chk_order_status_histories_from CHECK (from_status IS NULL OR from_status IN ('new','confirmed','completed','cancelled','returned')),
      CONSTRAINT chk_order_status_histories_to CHECK (to_status IN ('new','confirmed','completed','cancelled','returned')),
      INDEX idx_order_status_order_time (tenant_id, order_id, changed_at),
      INDEX idx_order_status_changed_at (tenant_id, changed_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await queryRunner.query(`CREATE TABLE shipping_status_histories (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      shipment_id BIGINT UNSIGNED NOT NULL,
      from_status VARCHAR(32) NULL,
      to_status VARCHAR(32) NOT NULL,
      reason VARCHAR(500) NULL,
      changed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      changed_by BIGINT UNSIGNED NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL,
      created_by BIGINT UNSIGNED NULL,
      updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL,
      version INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (id),
      CONSTRAINT fk_shipping_status_histories_shipment FOREIGN KEY (shipment_id) REFERENCES shipments (id) ON DELETE RESTRICT,
      CONSTRAINT fk_shipping_status_histories_actor FOREIGN KEY (changed_by) REFERENCES user_accounts (id) ON DELETE SET NULL,
      CONSTRAINT chk_shipping_status_histories_from CHECK (from_status IS NULL OR from_status IN ('pending','shipped','delivered','cancelled','returned')),
      CONSTRAINT chk_shipping_status_histories_to CHECK (to_status IN ('pending','shipped','delivered','cancelled','returned')),
      INDEX idx_shipping_status_shipment_time (tenant_id, shipment_id, changed_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `shipping_status_histories`');
    await queryRunner.query('DROP TABLE IF EXISTS `order_status_histories`');
    await queryRunner.query(
      "UPDATE `orders` SET `order_status` = CASE WHEN `payment_status_snapshot` = 'paid' THEN 'confirmed' ELSE 'new' END WHERE `order_status` IN ('completed','cancelled','returned')",
    );
    await queryRunner.query(
      "UPDATE `orders` SET `shipping_status_snapshot` = 'pending' WHERE `shipping_status_snapshot` <> 'pending'",
    );
    await queryRunner.query(
      "UPDATE `shipments` SET `shipping_status` = 'pending' WHERE `shipping_status` <> 'pending'",
    );
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_status_v3`');
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_shipping_status_v2`');
    await queryRunner.query('ALTER TABLE `shipments` DROP CHECK `chk_shipments_status_v2`');
    await queryRunner.query(
      "ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_status_v2` CHECK (`order_status` IN ('new','confirmed'))",
    );
    await queryRunner.query(
      "ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_shipping_status` CHECK (`shipping_status_snapshot` IN ('pending'))",
    );
    await queryRunner.query(
      "ALTER TABLE `shipments` ADD CONSTRAINT `chk_shipments_status` CHECK (`shipping_status` IN ('pending'))",
    );
  }
}
