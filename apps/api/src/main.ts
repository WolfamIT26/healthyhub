import { readFileSync } from 'node:fs';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { AppLoggerService } from './common/logging/app-logger.service';
import { getValidatedEnvironment } from './config/environment';
import { resolveProjectFile } from './config/project-path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // ConfigModule đã nạp file môi trường ở workspace root trước khi bootstrap đọc config.
  const env = getValidatedEnvironment(process.env);
  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  app.enableShutdownHooks();
  app.setGlobalPrefix(env.api.prefix.replace(/^\/+/, ''));
  app.enableVersioning();

  app.use(helmet());
  app.use(json({ limit: env.security.requestBodyLimit }));
  app.use(urlencoded({ extended: true, limit: env.security.requestBodyLimit }));
  app.enableCors({
    origin: env.security.corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(logger, env));

  registerOpenApiDocs(app, env.api.docsPath);

  await app.listen(env.app.port, '0.0.0.0');
  logger.log(
    {
      event: 'api_started',
      port: env.app.port,
      prefix: env.api.prefix,
      docsPath: env.api.docsPath,
    },
    'Bootstrap',
  );
}

function registerOpenApiDocs(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
  docsPath: string,
): void {
  const documentConfig = new DocumentBuilder()
    .setTitle('HealthyHub API Foundation')
    .setDescription('Swagger UI shell. Contract chính thức được tải từ openapi/openapi.yaml.')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  const normalizedDocsPath = docsPath.replace(/^\/+/, '');

  SwaggerModule.setup(normalizedDocsPath, app, document, {
    swaggerOptions: {
      url: `/${normalizedDocsPath}/openapi.yaml`,
    },
  });

  app.getHttpAdapter().get(`/${normalizedDocsPath}/openapi.yaml`, (_request, response) => {
    const openApiPath = resolveProjectFile('openapi/openapi.yaml');
    if (!openApiPath) {
      response.status(404).type('application/json').send({
        success: false,
        status: 'error',
        message: 'Không tìm thấy file OpenAPI.',
      });
      return;
    }

    response.type('application/yaml').send(readFileSync(openApiPath, 'utf8'));
  });
}

void bootstrap();
