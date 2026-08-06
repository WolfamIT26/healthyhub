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

export class CreateUserIdentityFoundation1760000000000 implements MigrationInterface {
  name = 'CreateUserIdentityFoundation1760000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_accounts',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'email', type: 'varchar', length: '254' }),
          new TableColumn({ name: 'normalized_email', type: 'varchar', length: '254' }),
          new TableColumn({ name: 'phone', type: 'varchar', length: '32', isNullable: true }),
          new TableColumn({ name: 'display_name', type: 'varchar', length: '255' }),
          new TableColumn({ name: 'password_hash', type: 'varchar', length: '255' }),
          new TableColumn({
            name: 'user_status',
            type: 'varchar',
            length: '32',
            default: "'pending'",
          }),
          new TableColumn({
            name: 'email_verified_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          }),
          new TableColumn({
            name: 'locked_until',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          }),
          new TableColumn({
            name: 'last_login_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          }),
          new TableColumn({ name: 'permissions_version', type: 'int', unsigned: true, default: 1 }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_user_accounts_normalized_email',
            columnNames: ['normalized_email'],
          }),
        ],
        indices: [
          new TableIndex({ name: 'idx_user_accounts_status', columnNames: ['user_status'] }),
          new TableIndex({ name: 'idx_user_accounts_last_login', columnNames: ['last_login_at'] }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_user_accounts_status',
            expression: "`user_status` IN ('pending','active','locked','disabled')",
          }),
          new TableCheck({
            name: 'chk_user_accounts_permissions_version',
            expression: '`permissions_version` > 0',
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `user_accounts` ADD CONSTRAINT `chk_user_accounts_status` CHECK (`user_status` IN ('pending','active','locked','disabled')), ADD CONSTRAINT `chk_user_accounts_permissions_version` CHECK (`permissions_version` > 0)",
    );

    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'role_code', type: 'varchar', length: '64' }),
          new TableColumn({ name: 'role_name', type: 'varchar', length: '150' }),
          new TableColumn({
            name: 'role_scope',
            type: 'varchar',
            length: '64',
            default: "'application'",
          }),
          new TableColumn({
            name: 'role_status',
            type: 'varchar',
            length: '32',
            default: "'active'",
          }),
        ],
        uniques: [new TableUnique({ name: 'uq_roles_role_code', columnNames: ['role_code'] })],
        indices: [new TableIndex({ name: 'idx_roles_status', columnNames: ['role_status'] })],
        checks: [
          new TableCheck({
            name: 'chk_roles_code',
            expression: "`role_code` IN ('CUSTOMER','STAFF','MANAGER','ADMINISTRATOR')",
          }),
          new TableCheck({
            name: 'chk_roles_status',
            expression: "`role_status` IN ('active','inactive')",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `roles` ADD CONSTRAINT `chk_roles_code` CHECK (`role_code` IN ('CUSTOMER','STAFF','MANAGER','ADMINISTRATOR')), ADD CONSTRAINT `chk_roles_status` CHECK (`role_status` IN ('active','inactive'))",
    );

    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'permission_code', type: 'varchar', length: '100' }),
          new TableColumn({ name: 'permission_name', type: 'varchar', length: '150' }),
          new TableColumn({
            name: 'permission_status',
            type: 'varchar',
            length: '32',
            default: "'active'",
          }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_permissions_permission_code',
            columnNames: ['permission_code'],
          }),
        ],
        indices: [
          new TableIndex({ name: 'idx_permissions_status', columnNames: ['permission_status'] }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_permissions_status',
            expression: "`permission_status` IN ('active','inactive')",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `permissions` ADD CONSTRAINT `chk_permissions_status` CHECK (`permission_status` IN ('active','inactive'))",
    );

    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'role_id', type: 'bigint', unsigned: true }),
          new TableColumn({ name: 'permission_id', type: 'bigint', unsigned: true }),
          new TableColumn({
            name: 'assigned_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
          }),
          new TableColumn({
            name: 'assignment_status',
            type: 'varchar',
            length: '32',
            default: "'active'",
          }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_role_permissions_role_permission',
            columnNames: ['role_id', 'permission_id'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_role_permissions_role',
            columnNames: ['role_id'],
            referencedTableName: 'roles',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
          new TableForeignKey({
            name: 'fk_role_permissions_permission',
            columnNames: ['permission_id'],
            referencedTableName: 'permissions',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_role_permissions_permission',
            columnNames: ['permission_id'],
          }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_role_permissions_status',
            expression: "`assignment_status` IN ('active','revoked')",
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `role_permissions` ADD CONSTRAINT `chk_role_permissions_status` CHECK (`assignment_status` IN ('active','revoked'))",
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_role_assignments',
        columns: [
          ...auditColumns(),
          new TableColumn({ name: 'user_account_id', type: 'bigint', unsigned: true }),
          new TableColumn({ name: 'role_id', type: 'bigint', unsigned: true }),
          new TableColumn({
            name: 'assigned_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
          }),
          new TableColumn({ name: 'expires_at', type: 'datetime', precision: 3, isNullable: true }),
          new TableColumn({
            name: 'assignment_status',
            type: 'varchar',
            length: '32',
            default: "'active'",
          }),
        ],
        uniques: [
          new TableUnique({
            name: 'uq_user_roles_user_role',
            columnNames: ['user_account_id', 'role_id'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_user_roles_user',
            columnNames: ['user_account_id'],
            referencedTableName: 'user_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
          new TableForeignKey({
            name: 'fk_user_roles_role',
            columnNames: ['role_id'],
            referencedTableName: 'roles',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_user_roles_user_status',
            columnNames: ['user_account_id', 'assignment_status'],
          }),
        ],
        checks: [
          new TableCheck({
            name: 'chk_user_roles_status',
            expression: "`assignment_status` IN ('active','expired','revoked')",
          }),
          new TableCheck({
            name: 'chk_user_roles_expiry',
            expression: '`expires_at` IS NULL OR `expires_at` > `assigned_at`',
          }),
        ],
      }),
      true,
    );
    await queryRunner.query(
      "ALTER TABLE `user_role_assignments` ADD CONSTRAINT `chk_user_roles_status` CHECK (`assignment_status` IN ('active','expired','revoked')), ADD CONSTRAINT `chk_user_roles_expiry` CHECK (`expires_at` IS NULL OR `expires_at` > `assigned_at`)",
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_role_assignments', true);
    await queryRunner.dropTable('role_permissions', true);
    await queryRunner.dropTable('permissions', true);
    await queryRunner.dropTable('roles', true);
    await queryRunner.dropTable('user_accounts', true);
  }
}
