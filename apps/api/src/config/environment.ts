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
  authentication: {
    jwtSecret: string;
    jwtIssuer: string;
    jwtAudience: string;
    csrfSecret: string;
    identifierHmacSecret: string;
    accessTokenTtlSeconds: number;
    refreshTokenTtlSeconds: number;
    resetTokenTtlSeconds: number;
    verificationTokenTtlSeconds: number;
    argonMemoryCostKib: number;
    argonTimeCost: number;
    argonParallelism: number;
    allowedOrigins: string[];
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
  payment: {
    provider: 'not_configured' | 'vnpay';
    vnpay: {
      tmnCode: string;
      hashSecret: string;
      paymentUrl: string;
      apiUrl: string;
      returnUrl: string;
      ipnUrl: string;
    };
  };
}

export function getValidatedEnvironment(source: NodeJS.ProcessEnv): HealthyHubEnvironment {
  const appEnv = normalizeEnvironment(source.APP_ENV ?? source.NODE_ENV ?? 'development');
  const env: HealthyHubEnvironment = {
    app: {
      name: source.APP_NAME ?? 'HealthyHub',
      env: appEnv,
      nodeEnv: source.NODE_ENV ?? appEnv,
      url: source.APP_URL ?? 'http://localhost:3100',
      port: parseRequiredPort(source.API_PORT, 'API_PORT'),
      logLevel: source.LOG_LEVEL ?? (appEnv === 'development' ? 'debug' : 'info'),
    },
    api: {
      prefix: source.API_PREFIX ?? API_PREFIX,
      docsPath: source.API_DOCS_PATH ?? API_DOCS_PATH,
      contractVersion: CONTRACT_VERSION,
    },
    security: {
      corsOrigins: parseCsv(source.CORS_ORIGINS ?? 'http://localhost:3100'),
      requestBodyLimit: source.REQUEST_BODY_LIMIT ?? '1mb',
      rateLimitTtlMs: parsePositiveNumber(source.RATE_LIMIT_TTL_MS, 60000, 'RATE_LIMIT_TTL_MS'),
      rateLimitLimit: parsePositiveNumber(source.RATE_LIMIT_LIMIT, 100, 'RATE_LIMIT_LIMIT'),
      redactionKeys: parseCsv(source.LOG_REDACTION_KEYS ?? SENSITIVE_LOG_KEYS.join(',')),
    },
    authentication: {
      jwtSecret: requireValue(source.AUTH_JWT_SECRET ?? source.JWT_SECRET, 'AUTH_JWT_SECRET'),
      jwtIssuer: source.AUTH_JWT_ISSUER ?? 'healthyhub-api',
      jwtAudience: source.AUTH_JWT_AUDIENCE ?? 'healthyhub-clients',
      csrfSecret: requireValue(source.AUTH_CSRF_SECRET, 'AUTH_CSRF_SECRET'),
      identifierHmacSecret: requireValue(
        source.AUTH_IDENTIFIER_HMAC_SECRET,
        'AUTH_IDENTIFIER_HMAC_SECRET',
      ),
      accessTokenTtlSeconds: parsePositiveNumber(
        source.AUTH_ACCESS_TOKEN_TTL_SECONDS,
        900,
        'AUTH_ACCESS_TOKEN_TTL_SECONDS',
      ),
      refreshTokenTtlSeconds: parsePositiveNumber(
        source.AUTH_REFRESH_TOKEN_TTL_SECONDS,
        2_592_000,
        'AUTH_REFRESH_TOKEN_TTL_SECONDS',
      ),
      resetTokenTtlSeconds: parsePositiveNumber(
        source.AUTH_RESET_TOKEN_TTL_SECONDS,
        900,
        'AUTH_RESET_TOKEN_TTL_SECONDS',
      ),
      verificationTokenTtlSeconds: parsePositiveNumber(
        source.AUTH_VERIFICATION_TOKEN_TTL_SECONDS,
        86_400,
        'AUTH_VERIFICATION_TOKEN_TTL_SECONDS',
      ),
      argonMemoryCostKib: parsePositiveNumber(
        source.AUTH_ARGON_MEMORY_COST_KIB,
        19_456,
        'AUTH_ARGON_MEMORY_COST_KIB',
      ),
      argonTimeCost: parsePositiveNumber(source.AUTH_ARGON_TIME_COST, 2, 'AUTH_ARGON_TIME_COST'),
      argonParallelism: parsePositiveNumber(
        source.AUTH_ARGON_PARALLELISM,
        1,
        'AUTH_ARGON_PARALLELISM',
      ),
      allowedOrigins: parseCsv(source.AUTH_ALLOWED_ORIGINS ?? source.CORS_ORIGINS ?? ''),
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
    payment: {
      provider: parsePaymentProvider(source.PAYMENT_PROVIDER),
      vnpay: {
        tmnCode: source.VNPAY_TMN_CODE ?? '',
        hashSecret: source.VNPAY_HASH_SECRET ?? '',
        paymentUrl: source.VNPAY_PAYMENT_URL ?? '',
        apiUrl: source.VNPAY_API_URL ?? '',
        returnUrl: source.VNPAY_RETURN_URL ?? '',
        ipnUrl: source.VNPAY_IPN_URL ?? '',
      },
    },
  };

  validatePaymentConfiguration(env);
  validateProductionSafety(env);
  validateTypeOrmSafety(env);

  return env;
}

export function validateEnvironmentSource(source: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  getValidatedEnvironment(source);
  return source;
}

function parsePaymentProvider(value: string | undefined): 'not_configured' | 'vnpay' {
  const provider = (value ?? 'not_configured').trim().toLowerCase();
  if (provider === 'not_configured' || provider === 'vnpay') return provider;
  throw new Error(`PAYMENT_PROVIDER không được hỗ trợ: ${provider}`);
}

function validatePaymentConfiguration(env: HealthyHubEnvironment): void {
  if (env.payment.provider !== 'vnpay') return;
  const required = Object.entries(env.payment.vnpay);
  const missing = required.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) throw new Error(`Thiếu cấu hình VNPAY: ${missing.join(', ')}.`);
  if (!/^[A-Za-z0-9]{8}$/.test(env.payment.vnpay.tmnCode)) {
    throw new Error('VNPAY_TMN_CODE phải gồm đúng 8 ký tự chữ hoặc số.');
  }
  for (const [name, value] of required.filter(([name]) => name.endsWith('Url'))) {
    try {
      new URL(value);
    } catch {
      throw new Error(`Cấu hình VNPAY ${name} phải là URL hợp lệ.`);
    }
  }
  if (new URL(env.payment.vnpay.ipnUrl).protocol !== 'https:') {
    throw new Error('VNPAY_IPN_URL phải là HTTPS public callback để VNPAY gọi server-to-server.');
  }
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
  return parsePortNumber(value ?? fallback, name);
}

function parseRequiredPort(value: string | undefined, name: string): number {
  return parsePortNumber(requireValue(value, name), name);
}

function parsePortNumber(value: string | number, name: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} phải là số nguyên dương.`);
  }
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
  const values = [
    env.database.host,
    env.database.password,
    env.authentication.jwtSecret,
    env.authentication.csrfSecret,
    env.authentication.identifierHmacSecret,
  ];

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
