import type { QueryRunner, Table } from 'typeorm';
import { describe, expect, it } from 'vitest';

import { CreateUserIdentityFoundation1760000000000 } from './1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from './1760000001000-create-authentication-data';

interface MigrationCapture {
  created: Table[];
  dropped: string[];
  queries: string[];
  runner: QueryRunner;
}

function createMigrationCapture(): MigrationCapture {
  const created: Table[] = [];
  const dropped: string[] = [];
  const queries: string[] = [];
  const runner = {
    createTable: async (table: Table) => {
      created.push(table);
    },
    dropTable: async (tableName: string) => {
      dropped.push(tableName);
    },
    query: async (query: string) => {
      queries.push(query);
    },
  } as unknown as QueryRunner;
  return { created, dropped, queries, runner };
}

describe('authentication migrations', () => {
  it('creates and rolls back the User identity foundation in dependency order', async () => {
    const capture = createMigrationCapture();
    const migration = new CreateUserIdentityFoundation1760000000000();

    await migration.up(capture.runner);
    expect(capture.created.map((table) => table.name)).toEqual([
      'user_accounts',
      'roles',
      'permissions',
      'role_permissions',
      'user_role_assignments',
    ]);
    expect(
      capture.created
        .find((table) => table.name === 'user_accounts')
        ?.uniques.some((unique) => unique.name === 'uq_user_accounts_normalized_email'),
    ).toBe(true);
    expect(capture.queries).toHaveLength(5);

    await migration.down(capture.runner);
    expect(capture.dropped).toEqual([
      'user_role_assignments',
      'role_permissions',
      'permissions',
      'roles',
      'user_accounts',
    ]);
  });

  it('creates four Authentication tables with hash, expiry, FK and rotation metadata', async () => {
    const capture = createMigrationCapture();
    const migration = new CreateAuthenticationData1760000001000();

    await migration.up(capture.runner);
    expect(capture.created.map((table) => table.name)).toEqual([
      'authentication_sessions',
      'login_attempts',
      'password_reset_requests',
      'account_verifications',
    ]);

    const sessions = capture.created.find((table) => table.name === 'authentication_sessions');
    expect(sessions?.findColumnByName('refresh_token_hash')?.length).toBe('64');
    expect(sessions?.findColumnByName('refresh_token_generation')).toBeDefined();
    expect(sessions?.findColumnByName('expires_at')).toBeDefined();
    expect(sessions?.foreignKeys[0]?.onDelete).toBe('RESTRICT');
    expect(capture.queries).toHaveLength(4);

    await migration.down(capture.runner);
    expect(capture.dropped).toEqual([
      'account_verifications',
      'password_reset_requests',
      'login_attempts',
      'authentication_sessions',
    ]);
  });
});
