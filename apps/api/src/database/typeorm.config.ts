import { join } from 'node:path';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import type { HealthyHubEnvironment } from '../config/environment';

export function createTypeOrmOptions(env: HealthyHubEnvironment): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: env.database.host,
    port: env.database.port,
    username: env.database.user,
    password: env.database.password,
    database: env.database.name,
    synchronize: env.database.synchronize,
    logging: env.database.logging,
    autoLoadEntities: true,
    entities: [join(__dirname, '../**/*.entity.{js,ts}')],
    migrations: [join(__dirname, 'migrations/*.{js,ts}')],
    migrationsTableName: 'schema_migrations',
    timezone: 'Z',
    charset: 'utf8mb4',
    retryAttempts: 5,
    retryDelay: 2000,
  };
}
