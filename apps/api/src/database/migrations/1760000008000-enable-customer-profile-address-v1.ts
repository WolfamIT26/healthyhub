import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableCustomerProfileAddressV11760000008000 implements MigrationInterface {
  name = 'EnableCustomerProfileAddressV11760000008000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`customer_addresses\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`customer_profile_id\` BIGINT UNSIGNED NOT NULL,
      \`recipient_name\` VARCHAR(255) NOT NULL,
      \`phone\` VARCHAR(32) NOT NULL,
      \`country_code\` CHAR(2) NOT NULL DEFAULT 'VN',
      \`province_city\` VARCHAR(150) NOT NULL,
      \`district\` VARCHAR(150) NOT NULL,
      \`ward\` VARCHAR(150) NULL,
      \`address_line\` VARCHAR(500) NOT NULL,
      \`delivery_note\` VARCHAR(500) NULL,
      \`is_default\` TINYINT(1) NOT NULL DEFAULT 0,
      \`address_status\` VARCHAR(32) NOT NULL DEFAULT 'active',
      \`idempotency_key_hash\` CHAR(64) NULL,
      \`request_hash\` CHAR(64) NULL,
      \`active_default_customer_id\` BIGINT UNSIGNED GENERATED ALWAYS AS (
        CASE WHEN \`address_status\` = 'active' AND \`is_default\` = 1 AND \`deleted_at\` IS NULL
        THEN \`customer_profile_id\` ELSE NULL END
      ) STORED,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL,
      \`created_by\` BIGINT UNSIGNED NULL,
      \`updated_by\` BIGINT UNSIGNED NULL,
      \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_customer_addresses_profile\` FOREIGN KEY (\`customer_profile_id\`)
        REFERENCES \`customer_profiles\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`chk_customer_addresses_country\` CHECK (\`country_code\` = 'VN'),
      CONSTRAINT \`chk_customer_addresses_default\` CHECK (\`is_default\` IN (0, 1)),
      CONSTRAINT \`chk_customer_addresses_status\` CHECK (\`address_status\` IN ('active', 'archived')),
      CONSTRAINT \`uq_customer_addresses_active_default\` UNIQUE (\`active_default_customer_id\`),
      CONSTRAINT \`uq_customer_addresses_idempotency\` UNIQUE (
        \`tenant_id\`, \`customer_profile_id\`, \`idempotency_key_hash\`
      ),
      INDEX \`idx_customer_addresses_customer_status\` (
        \`tenant_id\`, \`customer_profile_id\`, \`address_status\`, \`updated_at\`
      )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `customer_addresses`');
  }
}
