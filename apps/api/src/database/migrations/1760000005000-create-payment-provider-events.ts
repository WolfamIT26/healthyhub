import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentProviderEvents1760000005000 implements MigrationInterface {
  name = 'CreatePaymentProviderEvents1760000005000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`payment_provider_events\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`provider\` VARCHAR(32) NOT NULL, \`provider_event_id\` VARCHAR(191) NOT NULL, \`event_type\` VARCHAR(100) NOT NULL,
      \`payment_id\` BIGINT UNSIGNED NULL, \`provider_reference\` VARCHAR(191) NOT NULL, \`payload_hash\` CHAR(64) NOT NULL,
      \`processing_status\` VARCHAR(32) NOT NULL DEFAULT 'received', \`received_at\` DATETIME(3) NOT NULL,
      \`processing_started_at\` DATETIME(3) NULL, \`processed_at\` DATETIME(3) NULL, \`failure_code\` VARCHAR(100) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_payment_provider_events_payment\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_payment_provider_events_identity\` UNIQUE (\`tenant_id\`, \`provider\`, \`provider_event_id\`),
      CONSTRAINT \`chk_payment_provider_events_status\` CHECK (\`processing_status\` IN ('received','processing','processed','rejected','failed')),
      INDEX \`idx_payment_provider_events_payment_time\` (\`tenant_id\`, \`payment_id\`, \`received_at\`),
      INDEX \`idx_payment_provider_events_status_time\` (\`tenant_id\`, \`processing_status\`, \`received_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `payment_provider_events`');
  }
}
