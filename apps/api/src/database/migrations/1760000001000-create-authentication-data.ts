import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableColumn,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

const auditColumns = (): TableColumn[] => [
  new TableColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  }),
  new TableColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 3,
    default: 'CURRENT_TIMESTAMP(3)',
  }),
  new TableColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 3,
    default: 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  }),
  new TableColumn({ name: 'deleted_at', type: 'datetime', precision: 3, isNullable: true }),
  new TableColumn({ name: 'created_by', type: 'bigint', unsigned: true, isNullable: true }),
  new TableColumn({ name: 'updated_by', type: 'bigint', unsigned: true, isNullable: true }),
  new TableColumn({ name: 'deleted_by', type: 'bigint', unsigned: true, isNullable: true }),
  new TableColumn({ name: 'version', type: 'int', unsigned: true, default: 1 }),
];

export class CreateAuthenticationData1760000001000 implements MigrationInterface {
  name = 'CreateAuthenticationData1760000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'authentication_sessions',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'user_account_id', type: 'bigint', unsigned: true }),
          new TableColumn({ name: 'session_public_id', type: 'char', length: '36' }),
          new TableColumn({
            name: 'session_status',
            type: 'varchar',
            length: '32',
            default: "'active'",
          }),
          new TableColumn({ name: 'refresh_token_hash', type: 'char', length: '64' }),
          new TableColumn({ name: 'refresh_token_family_id', type: 'char', length: '36' }),
          new TableColumn({
            name: 'refresh_token_generation',
            type: 'int',
            unsigned: true,
            default: 1,
          }),
          new TableColumn({ name: 'session_context', type: 'json', isNullable: true }),
          new TableColumn({ name: 'issued_at', type: 'datetime', precision: 3 }),
          new TableColumn({ name: 'last_used_at', type: 'datetime', precision: 3 }),
          new TableColumn({ name: 'expires_at', type: 'datetime', precision: 3 }),
          new TableColumn({ name: 'revoked_at', type: 'datetime', precision: 3, isNullable: true }),
          new TableColumn({
            name: 'compromised_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          }),
          new TableColumn({
            name: 'revoked_reason',
            type: 'varchar',
            length: '64',
            isNullable: true,
          }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_auth_sessions_public_id',
            columnNames: ['session_public_id'],
          }),
          new TableUnique({
            name: 'uq_auth_sessions_refresh_hash',
            columnNames: ['refresh_token_hash'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_auth_sessions_user',
            columnNames: ['user_account_id'],
            referencedTableName: 'user_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_auth_sessions_user_status',
            columnNames: ['user_account_id', 'session_status'],
          }),
          new TableIndex({ name: 'idx_auth_sessions_expires', columnNames: ['expires_at'] }),
          new TableIndex({
            name: 'idx_auth_sessions_family_status',
            columnNames: ['refresh_token_family_id', 'session_status'],
          }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_auth_sessions_status',
            expression: "`session_status` IN ('active','expired','revoked','compromised')",
          }),
          new TableCheck({
            name: 'chk_auth_sessions_expiry',
            expression: '`expires_at` > `issued_at`',
          }),
          new TableCheck({
            name: 'chk_auth_sessions_generation',
            expression: '`refresh_token_generation` > 0',
          }),
          new TableCheck({
            name: 'chk_auth_sessions_terminal',
            expression: "(`session_status` IN ('active','expired')) OR (`revoked_at` IS NOT NULL)",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `authentication_sessions` ADD CONSTRAINT `chk_auth_sessions_status` CHECK (`session_status` IN ('active','expired','revoked','compromised')), ADD CONSTRAINT `chk_auth_sessions_expiry` CHECK (`expires_at` > `issued_at`), ADD CONSTRAINT `chk_auth_sessions_generation` CHECK (`refresh_token_generation` > 0), ADD CONSTRAINT `chk_auth_sessions_terminal` CHECK ((`session_status` IN ('active','expired')) OR (`revoked_at` IS NOT NULL))",
    );

    await queryRunner.createTable(
      new Table({
        name: 'login_attempts',
        columns: [
          ...auditColumns(),
          new TableColumn({
            name: 'user_account_id',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
          }),
          new TableColumn({ name: 'identifier_hash', type: 'char', length: '64' }),
          new TableColumn({
            name: 'attempt_status',
            type: 'varchar',
            length: '32',
            default: "'failed'",
          }),
          new TableColumn({
            name: 'failure_reason',
            type: 'varchar',
            length: '64',
            isNullable: true,
          }),
          new TableColumn({ name: 'ip_hash', type: 'char', length: '64', isNullable: true }),
          new TableColumn({
            name: 'user_agent_family',
            type: 'varchar',
            length: '100',
            isNullable: true,
          }),
          new TableColumn({ name: 'attempted_at', type: 'datetime', precision: 3 }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_login_attempts_user',
            columnNames: ['user_account_id'],
            referencedTableName: 'user_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_login_attempts_identifier_time',
            columnNames: ['identifier_hash', 'attempted_at'],
          }),
          new TableIndex({
            name: 'idx_login_attempts_ip_time',
            columnNames: ['ip_hash', 'attempted_at'],
          }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_login_attempts_status',
            expression: "`attempt_status` IN ('success','failed','blocked')",
          }),
          new TableCheck({
            name: 'chk_login_attempts_failure_reason',
            expression: "`attempt_status` = 'success' OR `failure_reason` IS NOT NULL",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `login_attempts` ADD CONSTRAINT `chk_login_attempts_status` CHECK (`attempt_status` IN ('success','failed','blocked')), ADD CONSTRAINT `chk_login_attempts_failure_reason` CHECK (`attempt_status` = 'success' OR `failure_reason` IS NOT NULL)",
    );

    await queryRunner.createTable(
      new Table({
        name: 'password_reset_requests',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'user_account_id', type: 'bigint', unsigned: true }),
          new TableColumn({
            name: 'request_status',
            type: 'varchar',
            length: '32',
            default: "'requested'",
          }),
          new TableColumn({ name: 'token_reference', type: 'char', length: '64' }),
          new TableColumn({ name: 'requested_at', type: 'datetime', precision: 3 }),
          new TableColumn({ name: 'expires_at', type: 'datetime', precision: 3 }),
          new TableColumn({ name: 'used_at', type: 'datetime', precision: 3, isNullable: true }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_password_reset_token_reference',
            columnNames: ['token_reference'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_password_reset_user',
            columnNames: ['user_account_id'],
            referencedTableName: 'user_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_password_reset_user_status',
            columnNames: ['user_account_id', 'request_status'],
          }),
          new TableIndex({ name: 'idx_password_reset_expires', columnNames: ['expires_at'] }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_password_reset_status',
            expression: "`request_status` IN ('requested','used','expired','cancelled')",
          }),
          new TableCheck({
            name: 'chk_password_reset_expiry',
            expression: '`expires_at` > `requested_at`',
          }),
          new TableCheck({
            name: 'chk_password_reset_used',
            expression: "`request_status` <> 'used' OR `used_at` IS NOT NULL",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `password_reset_requests` ADD CONSTRAINT `chk_password_reset_status` CHECK (`request_status` IN ('requested','used','expired','cancelled')), ADD CONSTRAINT `chk_password_reset_expiry` CHECK (`expires_at` > `requested_at`), ADD CONSTRAINT `chk_password_reset_used` CHECK (`request_status` <> 'used' OR `used_at` IS NOT NULL)",
    );

    await queryRunner.createTable(
      new Table({
        name: 'account_verifications',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'user_account_id', type: 'bigint', unsigned: true }),
          new TableColumn({ name: 'verification_type', type: 'varchar', length: '32' }),
          new TableColumn({
            name: 'verification_status',
            type: 'varchar',
            length: '32',
            default: "'pending'",
          }),
          new TableColumn({ name: 'token_reference', type: 'char', length: '64' }),
          new TableColumn({ name: 'expires_at', type: 'datetime', precision: 3 }),
          new TableColumn({
            name: 'verified_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_account_verifications_token_reference',
            columnNames: ['token_reference'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_account_verifications_user',
            columnNames: ['user_account_id'],
            referencedTableName: 'user_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_account_verifications_user_type_status',
            columnNames: ['user_account_id', 'verification_type', 'verification_status'],
          }),
          new TableIndex({
            name: 'idx_account_verifications_expires',
            columnNames: ['expires_at'],
          }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_account_verifications_type',
            expression: "`verification_type` = 'email'",
          }),
          new TableCheck({
            name: 'chk_account_verifications_status',
            expression: "`verification_status` IN ('pending','verified','expired','superseded')",
          }),
          new TableCheck({
            name: 'chk_account_verifications_verified',
            expression: "`verification_status` <> 'verified' OR `verified_at` IS NOT NULL",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `account_verifications` ADD CONSTRAINT `chk_account_verifications_type` CHECK (`verification_type` = 'email'), ADD CONSTRAINT `chk_account_verifications_status` CHECK (`verification_status` IN ('pending','verified','expired','superseded')), ADD CONSTRAINT `chk_account_verifications_verified` CHECK (`verification_status` <> 'verified' OR `verified_at` IS NOT NULL)",
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account_verifications', true);
    await queryRunner.dropTable('password_reset_requests', true);
    await queryRunner.dropTable('login_attempts', true);
    await queryRunner.dropTable('authentication_sessions', true);
  }
}
