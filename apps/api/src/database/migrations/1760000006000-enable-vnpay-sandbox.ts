import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableVnpaySandbox1760000006000 implements MigrationInterface {
  name = 'EnableVnpaySandbox1760000006000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `payments` DROP CHECK `chk_payments_method`');
    await queryRunner.query('ALTER TABLE `payments` DROP CHECK `chk_payments_status`');
    await queryRunner.query("ALTER TABLE `payments` ADD CONSTRAINT `chk_payments_method_v2` CHECK (`payment_method` IN ('cod','vnpay'))");
    await queryRunner.query("ALTER TABLE `payments` ADD CONSTRAINT `chk_payments_status_v2` CHECK (`payment_status` IN ('unpaid','pending','paid','failed','cancelled'))");
    await queryRunner.query(`CREATE TABLE \`payment_attempts\` (
      \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, \`tenant_id\` BIGINT UNSIGNED NOT NULL DEFAULT 1,
      \`payment_id\` BIGINT UNSIGNED NOT NULL, \`provider\` VARCHAR(32) NOT NULL, \`provider_reference\` VARCHAR(100) NOT NULL,
      \`provider_transaction_no\` VARCHAR(32) NULL, \`amount\` DECIMAL(12,2) NOT NULL, \`currency\` CHAR(3) NOT NULL DEFAULT 'VND',
      \`attempt_status\` VARCHAR(32) NOT NULL DEFAULT 'pending', \`idempotency_key_hash\` CHAR(64) NOT NULL,
      \`expires_at\` DATETIME(3) NOT NULL, \`completed_at\` DATETIME(3) NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      \`deleted_at\` DATETIME(3) NULL, \`created_by\` BIGINT UNSIGNED NULL, \`updated_by\` BIGINT UNSIGNED NULL, \`deleted_by\` BIGINT UNSIGNED NULL,
      \`version\` INT UNSIGNED NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`),
      CONSTRAINT \`fk_payment_attempts_payment\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\` (\`id\`) ON DELETE RESTRICT,
      CONSTRAINT \`uq_payment_attempts_provider_reference\` UNIQUE (\`tenant_id\`,\`provider\`,\`provider_reference\`),
      CONSTRAINT \`uq_payment_attempts_idempotency\` UNIQUE (\`tenant_id\`,\`payment_id\`,\`idempotency_key_hash\`),
      CONSTRAINT \`chk_payment_attempts_provider\` CHECK (\`provider\` IN ('vnpay')),
      CONSTRAINT \`chk_payment_attempts_status\` CHECK (\`attempt_status\` IN ('pending','paid','failed','cancelled')),
      CONSTRAINT \`chk_payment_attempts_amount\` CHECK (\`amount\` >= 0),
      INDEX \`idx_payment_attempts_payment_time\` (\`tenant_id\`,\`payment_id\`,\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `payment_attempts`');
    await queryRunner.query('ALTER TABLE `payments` DROP CHECK `chk_payments_method_v2`');
    await queryRunner.query('ALTER TABLE `payments` DROP CHECK `chk_payments_status_v2`');
    await queryRunner.query("ALTER TABLE `payments` ADD CONSTRAINT `chk_payments_method` CHECK (`payment_method` IN ('cod'))");
    await queryRunner.query("ALTER TABLE `payments` ADD CONSTRAINT `chk_payments_status` CHECK (`payment_status` IN ('pending'))");
  }
}
