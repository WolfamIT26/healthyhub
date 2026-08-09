import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getValidatedEnvironment } from '../../src/config/environment';
import * as authenticationEntities from '../../src/data/authentication/entities';
import * as cartEntities from '../../src/data/cart/entities';
import * as customerEntities from '../../src/data/customer/entities';
import * as inventoryEntities from '../../src/data/inventory/entities';
import * as productEntities from '../../src/data/product/entities';
import * as userEntities from '../../src/data/user/entities';
import { CreateUserIdentityFoundation1760000000000 } from '../../src/database/migrations/1760000000000-create-user-identity-foundation';
import { CreateAuthenticationData1760000001000 } from '../../src/database/migrations/1760000001000-create-authentication-data';
import { CreateCartDependencyFoundation1760000002000 } from '../../src/database/migrations/1760000002000-create-cart-dependency-foundation';
import { CreateCartPersistence1760000003000 } from '../../src/database/migrations/1760000003000-create-cart-persistence';
import { createTypeOrmOptions } from '../../src/database/typeorm.config';

const enabled = process.env.AUTH_MYSQL_INTEGRATION === 'true';

describe.skipIf(!enabled)('Authentication MySQL integration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      ...createTypeOrmOptions(getValidatedEnvironment(process.env)),
      migrations: [
        CreateUserIdentityFoundation1760000000000,
        CreateAuthenticationData1760000001000,
        CreateCartDependencyFoundation1760000002000,
        CreateCartPersistence1760000003000,
      ],
      entities: [
        ...Object.values(authenticationEntities),
        ...Object.values(cartEntities),
        ...Object.values(customerEntities),
        ...Object.values(inventoryEntities),
        ...Object.values(productEntities),
        ...Object.values(userEntities),
      ],
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('has no pending authentication migrations', async () => {
    await expect(dataSource.showMigrations()).resolves.toBe(false);
  });

  it('contains the account, session and one-time-token tables', async () => {
    const runner = dataSource.createQueryRunner();
    for (const tableName of [
      'user_accounts',
      'authentication_sessions',
      'login_attempts',
      'password_reset_requests',
      'account_verifications',
    ]) {
      await expect(runner.hasTable(tableName)).resolves.toBe(true);
    }
    await runner.release();
  });

  it('enforces unique normalized email and refresh-token hash indexes', async () => {
    const runner = dataSource.createQueryRunner();
    const users = await runner.getTable('user_accounts');
    const sessions = await runner.getTable('authentication_sessions');
    expect(users?.indices.some((index) => index.isUnique && index.columnNames.includes('normalized_email'))).toBe(true);
    expect(sessions?.indices.some((index) => index.isUnique && index.columnNames.includes('refresh_token_hash'))).toBe(true);
    await runner.release();
  });
});
