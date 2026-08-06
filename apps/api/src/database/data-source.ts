import 'reflect-metadata';

import { DataSource, type DataSourceOptions } from 'typeorm';

import { getValidatedEnvironment } from '../config/environment';
import { createTypeOrmOptions } from './typeorm.config';

const env = getValidatedEnvironment(process.env);
const options = createTypeOrmOptions(env);

export default new DataSource({
  ...options,
  migrationsRun: false,
} as DataSourceOptions);
