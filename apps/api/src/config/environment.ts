import {
  API_DOCS_PATH,
  API_PREFIX,
  CONTRACT_VERSION,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  SENSITIVE_LOG_KEYS,
} from '@healthyhub/shared-config';

export type AppEnvironment = 'development' | 'test' | 'production';

export interface HealthyHubEnvironment {
  app: {
    name: string;
    env: AppEnvironment;
    nodeEnv: string;
    url: string;
    port: number;
    logLevel: string;
  };
  api: {
    prefix: string;
    docsPath: string;
    contractVersion: typeof CONTRACT_VERSION;
  };
  security: {
    corsOrigins: string[];
    requestBodyLimit: string;
    rateLimitTtlMs: number;
    rateLimitLimit: number;
    redactionKeys: string[];
  };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
  };
}

export function getValidatedEnvironment(source: NodeJS.ProcessEnv): HealthyHubEnvironment {
  const appEnv = normalizeEnvironment(source.APP_ENV ?? source.NODE_ENV ?? 'development');
  const env: HealthyHubEnvironment = {
    app: {
      name: source.APP_NAME ?? 'HealthyHub',
      env: appEnv,
      nodeEnv: source.NODE_ENV ?? appEnv,
      url: source.APP_URL ?? 'http://localhost:3000',
      port: parsePort(source.API_PORT, 3001, 'API_PORT'),
      logLevel: source.LOG_LEVEL ?? (appEnv === 'development' ? 'debug' : 'info'),
    },
    api: {
      prefix: source.API_PREFIX ?? API_PREFIX,
      docsPath: source.API_DOCS_PATH ?? API_DOCS_PATH,
      contractVersion: CONTRACT_VERSION,
    },
    security: {
      corsOrigins: parseCsv(source.CORS_ORIGINS ?? 'http://localhost:3000'),
      requestBodyLimit: source.REQUEST_BODY_LIMIT ?? '1mb',
      rateLimitTtlMs: parsePositiveNumber(source.RATE_LIMIT_TTL_MS, 60000, 'RATE_LIMIT_TTL_MS'),
      rateLimitLimit: parsePositiveNumber(source.RATE_LIMIT_LIMIT, 100, 'RATE_LIMIT_LIMIT'),
      redactionKeys: parseCsv(source.LOG_REDACTION_KEYS ?? SENSITIVE_LOG_KEYS.join(',')),
    },
    database: {
      host: requireValue(source.MYSQL_HOST, 'MYSQL_HOST'),
      port: parsePort(source.MYSQL_PORT, 3306, 'MYSQL_PORT'),
      name: requireValue(source.MYSQL_DATABASE, 'MYSQL_DATABASE'),
      user: requireValue(source.MYSQL_USER, 'MYSQL_USER'),
      password: requireValue(source.MYSQL_PASSWORD, 'MYSQL_PASSWORD'),
      synchronize: parseBoolean(source.TYPEORM_SYNCHRONIZE, false),
      logging: parseBoolean(source.TYPEORM_LOGGING, false),
    },
  };

  validateProductionSafety(env);
  validateTypeOrmSafety(env);

  return env;
}

export function createResponseMetadata(env: HealthyHubEnvironment, requestDurationMs?: number) {
  return {
    timestamp: new Date().toISOString(),
    timezone: DEFAULT_TIMEZONE,
    locale: DEFAULT_LOCALE,
    requestDurationMs,
    environment: env.app.env,
  };
}

function normalizeEnvironment(value: string): AppEnvironment {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }

  throw new Error(`APP_ENV không hợp lệ: ${value}`);
}

function parseCsv(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePort(value: string | undefined, fallback: number, name: string): number {
  const parsed = parsePositiveNumber(value, fallback, name);
  if (parsed > 65535) {
    throw new Error(`${name} phải nhỏ hơn hoặc bằng 65535.`);
  }
  return parsed;
}

function parsePositiveNumber(value: string | undefined, fallback: number, name: string): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} phải là số nguyên dương.`);
  }
  return parsed;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }
  return value === 'true';
}

function requireValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} là biến môi trường bắt buộc.`);
  }
  return value;
}

function validateProductionSafety(env: HealthyHubEnvironment): void {
  if (env.app.env !== 'production') {
    return;
  }

  const unsafeFragments = ['change_me', 'replace_with'];
  const values = [env.database.host, env.database.password];

  for (const value of values) {
    if (unsafeFragments.some((fragment) => value.includes(fragment))) {
      throw new Error('Production không được dùng giá trị môi trường mẫu.');
    }
  }
}

function validateTypeOrmSafety(env: HealthyHubEnvironment): void {
  if (env.database.synchronize && env.app.env !== 'test') {
    throw new Error('TYPEORM_SYNCHRONIZE chỉ được bật ở môi trường test.');
  }
}
