import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceProductPrimaryCategoryV11760000012000 implements MigrationInterface {
  name = 'EnforceProductPrimaryCategoryV11760000012000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE product_category_links
      ADD COLUMN active_primary_product_id BIGINT UNSIGNED
        GENERATED ALWAYS AS (
          CASE WHEN is_primary = 1 AND link_status = 'active' AND deleted_at IS NULL
            THEN product_id ELSE NULL END
        ) STORED,
      ADD CONSTRAINT uq_product_category_one_active_primary
        UNIQUE (tenant_id, active_primary_product_id)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE product_category_links DROP INDEX uq_product_category_one_active_primary, DROP COLUMN active_primary_product_id',
    );
  }
}
