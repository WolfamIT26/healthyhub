import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { HealthyHubEnvironment } from '../../config/environment';
import { AuthenticationCrypto } from './authentication.crypto';
import { CurrentAuthentication } from './authentication.decorators';
import {
  ChangePasswordDto,
  EmailDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  TokenDto,
} from './authentication.dto';
import { AccessTokenGuard, parseCookies, RefreshCsrfGuard, RolesGuard } from './authentication.guards';
import { AuthenticationService } from './authentication.service';

const REFRESH_COOKIE = '__Host-hh_refresh';
const CSRF_COOKIE = 'hh_csrf';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authentication: AuthenticationService,
    private readonly crypto: AuthenticationCrypto,
    @Inject('HealthyHubEnvironment') private readonly env: HealthyHubEnvironment,
  ) {}

  @Post('register')
  @ApiOperation({ operationId: 'postAuthRegister' })
  register(@Body() body: RegisterDto) {
    return this.authentication.register(body);
  }

  @Post('login')
  @ApiOperation({ operationId: 'postAuthLogin' })
  async login(
    @Body() body: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('x-client-platform') platform?: string,
  ) {
    const result = await this.authentication.login(body, this.requestContext(request, platform));
    return this.deliverRefreshToken(result, response, platform);
  }

  @Post('refresh')
  @UseGuards(RefreshCsrfGuard)
  @ApiOperation({ operationId: 'postAuthRefresh' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('x-refresh-token') headerToken?: string,
    @Headers('x-client-platform') platform?: string,
  ) {
    const rawToken = headerToken ?? parseCookies(request.headers.cookie)[REFRESH_COOKIE] ?? '';
    const result = await this.authentication.refresh(rawToken);
    return this.deliverRefreshToken(result, response, headerToken ? 'mobile' : platform);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'postAuthLogout' })
  async logout(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authentication.logout(auth);
    this.clearCookies(response);
    return result;
  }

  @Post('verify-email')
  @ApiOperation({ operationId: 'postAuthVerifyEmail' })
  verifyEmail(@Body() body: TokenDto) {
    return this.authentication.verifyEmail(body.token);
  }

  @Post('resend-verification')
  @ApiOperation({ operationId: 'postAuthResendVerification' })
  resendVerification(@Body() body: EmailDto) {
    return this.authentication.resendVerification(body.email);
  }

  @Post('forgot-password')
  @ApiOperation({ operationId: 'postAuthForgotPassword' })
  forgotPassword(@Body() body: EmailDto) {
    return this.authentication.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ operationId: 'postAuthResetPassword' })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authentication.resetPassword(body);
  }

  @Post('change-password')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'postAuthChangePassword' })
  changePassword(
    @CurrentAuthentication() auth: AuthenticatedRequestContext,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authentication.changePassword(auth, body);
  }

  @Get('session')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'getAuthSession' })
  current(@CurrentAuthentication() auth: AuthenticatedRequestContext) {
    return this.authentication.current(auth);
  }

  private deliverRefreshToken(result: Awaited<ReturnType<AuthenticationService['login']>>, response: Response, platform?: string) {
    if (platform?.toLowerCase() === 'mobile') return result;
    const refreshToken = result.refreshToken;
    if (refreshToken) {
      response.cookie(REFRESH_COOKIE, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: this.env.authentication.refreshTokenTtlSeconds * 1000,
      });
      response.cookie(CSRF_COOKIE, this.crypto.signCsrf(this.crypto.randomToken()), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: this.env.authentication.refreshTokenTtlSeconds * 1000,
      });
      delete result.refreshToken;
    }
    return result;
  }

  private clearCookies(response: Response): void {
    response.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
    response.clearCookie(CSRF_COOKIE, { httpOnly: false, secure: true, sameSite: 'lax', path: '/' });
  }

  private requestContext(request: Request, platform?: string) {
    return {
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      platform,
    };
  }
}
