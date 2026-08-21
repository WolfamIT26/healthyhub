import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableInventoryStockLifecycleV11760000013000 implements MigrationInterface {
  name = 'EnableInventoryStockLifecycleV11760000013000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE stock_reservations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      inventory_item_id BIGINT UNSIGNED NOT NULL,
      order_id BIGINT UNSIGNED NOT NULL,
      reserved_quantity INT UNSIGNED NOT NULL,
      reservation_status VARCHAR(32) NOT NULL DEFAULT 'active',
      reserved_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      consumed_at DATETIME(3) NULL,
      released_at DATETIME(3) NULL,
      reacquired_at DATETIME(3) NULL,
      restocked_at DATETIME(3) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL,
      created_by BIGINT UNSIGNED NULL,
      updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL,
      version INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (id),
      CONSTRAINT uq_stock_reservations_tenant_order_item UNIQUE (tenant_id, order_id, inventory_item_id),
      CONSTRAINT fk_stock_reservations_inventory_item FOREIGN KEY (inventory_item_id) REFERENCES inventory_items (id) ON DELETE RESTRICT,
      CONSTRAINT fk_stock_reservations_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
      CONSTRAINT chk_stock_reservations_quantity CHECK (reserved_quantity > 0),
      CONSTRAINT chk_stock_reservations_status CHECK (reservation_status IN ('active','consumed','released','restocked')),
      INDEX idx_stock_reservations_item_status (tenant_id, inventory_item_id, reservation_status),
      INDEX idx_stock_reservations_order_status (tenant_id, order_id, reservation_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS stock_reservations');
  }
}
