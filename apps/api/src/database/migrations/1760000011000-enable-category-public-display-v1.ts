import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableCategoryPublicDisplayV11760000011000 implements MigrationInterface {
  name = 'EnableCategoryPublicDisplayV11760000011000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE category_display_rules (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      category_id BIGINT UNSIGNED NOT NULL, display_channel VARCHAR(32) NOT NULL DEFAULT 'web',
      display_order INT UNSIGNED NOT NULL DEFAULT 0, rule_status VARCHAR(32) NOT NULL DEFAULT 'active',
      effective_from DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), effective_to DATETIME(3) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL, version INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (id),
      CONSTRAINT fk_category_display_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT,
      CONSTRAINT uq_category_display_tenant_category_channel UNIQUE (tenant_id, category_id, display_channel),
      CONSTRAINT chk_category_display_channel CHECK (display_channel IN ('web','mobile','admin')),
      CONSTRAINT chk_category_display_status CHECK (rule_status IN ('active','inactive','expired')),
      CONSTRAINT chk_category_display_dates CHECK (effective_to IS NULL OR effective_to > effective_from),
      INDEX idx_category_display_channel_order (tenant_id, display_channel, rule_status, display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS category_display_rules');
  }
}
