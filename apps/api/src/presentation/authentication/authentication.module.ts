import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppLoggerService } from '../../common/logging/app-logger.service';
import { getValidatedEnvironment } from '../../config/environment';
import {
  AUTHENTICATION_REPOSITORY,
  TypeOrmAuthenticationRepository,
} from '../../data/authentication/repositories';
import {
  AUTHENTICATION_NOTIFICATION_GATEWAY,
  LocalAuthenticationNotificationGateway,
} from '../../gateways/notification/authentication-notification.gateway';
import { AuthenticationAuditService } from './authentication-audit.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationCrypto } from './authentication.crypto';
import {
  AccessTokenGuard,
  PermissionsGuard,
  RefreshCsrfGuard,
  RolesGuard,
} from './authentication.guards';
import { AuthenticationService } from './authentication.service';
import { AuthenticationTokenService } from './authentication-token.service';
import { AuthenticationRateLimitService } from './authentication-rate-limit.service';
import { EmailVerificationPolicyService } from './email-verification-policy.service';

const environmentProvider = {
  provide: 'HealthyHubEnvironment',
  useFactory: () => getValidatedEnvironment(process.env),
};

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthenticationController],
  providers: [
    environmentProvider,
    { provide: AUTHENTICATION_REPOSITORY, useClass: TypeOrmAuthenticationRepository },
    {
      provide: AUTHENTICATION_NOTIFICATION_GATEWAY,
      useClass: LocalAuthenticationNotificationGateway,
    },
    AppLoggerService,
    AuthenticationAuditService,
    AuthenticationCrypto,
    AuthenticationTokenService,
    AuthenticationService,
    AuthenticationRateLimitService,
    EmailVerificationPolicyService,
    AccessTokenGuard,
    RefreshCsrfGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [AccessTokenGuard, RolesGuard],
})
export class AuthenticationModule {}
