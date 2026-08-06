import { Injectable } from '@nestjs/common';
import type { AccountStatus, RoleName } from '@healthyhub/shared-types';
import { DataSource, MoreThan, type Repository } from 'typeorm';

import {
  AccountVerificationEntity,
  AuthenticationSessionEntity,
  LoginAttemptEntity,
  PasswordResetRequestEntity,
} from '../entities';
import {
  PermissionEntity,
  RoleEntity,
  RolePermissionEntity,
  UserAccountEntity,
  UserRoleAssignmentEntity,
} from '../../user/entities';
import type {
  AuthenticationRepository,
  CreateOneTimeTokenInput,
  CreateSessionInput,
  CreateUserAccountInput,
  RecordLoginAttemptInput,
  RotateSessionInput,
} from './authentication.repository';

@Injectable()
export class TypeOrmAuthenticationRepository implements AuthenticationRepository {
  private readonly users: Repository<UserAccountEntity>;
  private readonly sessions: Repository<AuthenticationSessionEntity>;
  private readonly attempts: Repository<LoginAttemptEntity>;
  private readonly resets: Repository<PasswordResetRequestEntity>;
  private readonly verifications: Repository<AccountVerificationEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.users = dataSource.getRepository(UserAccountEntity);
    this.sessions = dataSource.getRepository(AuthenticationSessionEntity);
    this.attempts = dataSource.getRepository(LoginAttemptEntity);
    this.resets = dataSource.getRepository(PasswordResetRequestEntity);
    this.verifications = dataSource.getRepository(AccountVerificationEntity);
  }

  findAccountById(userAccountId: string): Promise<UserAccountEntity | null> {
    return this.users.findOne({ where: { id: userAccountId } });
  }

  findAccountByNormalizedEmail(normalizedEmail: string): Promise<UserAccountEntity | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.normalizedEmail = :normalizedEmail', { normalizedEmail })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async emailExists(normalizedEmail: string): Promise<boolean> {
    return this.users.exists({ where: { normalizedEmail } });
  }

  createAccount(input: CreateUserAccountInput): Promise<UserAccountEntity> {
    return this.users.save(
      this.users.create({
        ...input,
        phone: input.phone ?? null,
        userStatus: 'pending',
        emailVerifiedAt: null,
        lockedUntil: null,
        lastLoginAt: null,
        permissionsVersion: 1,
      }),
    );
  }

  async assignRole(userAccountId: string, role: RoleName, assignedAt: Date): Promise<void> {
    const roleEntity = await this.dataSource.getRepository(RoleEntity).findOne({
      where: { roleCode: role, roleStatus: 'active' },
    });
    if (!roleEntity) throw new Error(`Role seed missing: ${role}`);
    const assignments = this.dataSource.getRepository(UserRoleAssignmentEntity);
    await assignments.save(
      assignments.create({
        userAccountId,
        roleId: roleEntity.id,
        assignedAt,
        expiresAt: null,
        assignmentStatus: 'active',
      }),
    );
  }

  async updatePassword(userAccountId: string, passwordHash: string): Promise<void> {
    await this.users.update(userAccountId, { passwordHash });
  }

  async markEmailVerified(userAccountId: string, verifiedAt: Date): Promise<void> {
    await this.users.update(userAccountId, {
      emailVerifiedAt: verifiedAt,
      userStatus: 'active',
      lockedUntil: null,
    });
  }

  async touchLastLogin(userAccountId: string, loggedInAt: Date): Promise<void> {
    await this.users.update(userAccountId, { lastLoginAt: loggedInAt });
  }

  async setAccountStatus(
    userAccountId: string,
    status: AccountStatus,
    lockedUntil: Date | null = null,
  ): Promise<void> {
    await this.users.update(userAccountId, { userStatus: status, lockedUntil });
  }

  createSession(input: CreateSessionInput): Promise<AuthenticationSessionEntity> {
    return this.sessions.save(
      this.sessions.create({
        userAccountId: input.userAccountId,
        sessionPublicId: input.sessionPublicId,
        sessionStatus: 'active',
        refreshTokenHash: input.refreshTokenHash,
        refreshTokenFamilyId: input.refreshTokenFamilyId,
        refreshTokenGeneration: 1,
        sessionContext: input.context ?? null,
        issuedAt: input.issuedAt,
        lastUsedAt: input.issuedAt,
        expiresAt: input.expiresAt,
        revokedAt: null,
        compromisedAt: null,
        revokedReason: null,
      }),
    );
  }

  findSessionByPublicId(sessionPublicId: string): Promise<AuthenticationSessionEntity | null> {
    return this.sessions
      .createQueryBuilder('session')
      .addSelect('session.refreshTokenHash')
      .where('session.sessionPublicId = :sessionPublicId', { sessionPublicId })
      .andWhere('session.deletedAt IS NULL')
      .getOne();
  }

  async rotateSession(input: RotateSessionInput): Promise<boolean> {
    const result = await this.sessions
      .createQueryBuilder()
      .update(AuthenticationSessionEntity)
      .set({
        refreshTokenHash: input.nextHash,
        refreshTokenGeneration: input.nextGeneration,
        lastUsedAt: input.lastUsedAt,
        expiresAt: input.expiresAt,
      })
      .where('id = :sessionId', { sessionId: input.sessionId })
      .andWhere('session_status = :status', { status: 'active' })
      .andWhere('refresh_token_generation = :expectedGeneration', {
        expectedGeneration: input.expectedGeneration,
      })
      .execute();
    return result.affected === 1;
  }

  async revokeSession(sessionId: string, reason: string, revokedAt: Date): Promise<void> {
    await this.sessions.update(sessionId, {
      sessionStatus: 'revoked',
      revokedReason: reason,
      revokedAt,
    });
  }

  async revokeAllSessions(userAccountId: string, reason: string, revokedAt: Date): Promise<number> {
    const result = await this.sessions
      .createQueryBuilder()
      .update(AuthenticationSessionEntity)
      .set({ sessionStatus: 'revoked', revokedReason: reason, revokedAt })
      .where('user_account_id = :userAccountId', { userAccountId })
      .andWhere('session_status = :status', { status: 'active' })
      .execute();
    return result.affected ?? 0;
  }

  async revokeOtherSessions(
    userAccountId: string,
    currentSessionId: string,
    reason: string,
    revokedAt: Date,
  ): Promise<number> {
    const result = await this.sessions
      .createQueryBuilder()
      .update(AuthenticationSessionEntity)
      .set({ sessionStatus: 'revoked', revokedReason: reason, revokedAt })
      .where('user_account_id = :userAccountId', { userAccountId })
      .andWhere('id != :currentSessionId', { currentSessionId })
      .andWhere('session_status = :status', { status: 'active' })
      .execute();
    return result.affected ?? 0;
  }

  async markRefreshReuse(sessionId: string, compromisedAt: Date): Promise<void> {
    await this.sessions.update(sessionId, {
      sessionStatus: 'compromised',
      compromisedAt,
      revokedAt: compromisedAt,
      revokedReason: 'refresh_token_reused',
    });
  }

  createPasswordReset(input: CreateOneTimeTokenInput): Promise<PasswordResetRequestEntity> {
    return this.resets.save(
      this.resets.create({
        userAccountId: input.userAccountId,
        requestStatus: 'requested',
        tokenReference: input.tokenReference,
        requestedAt: input.now,
        expiresAt: input.expiresAt,
        usedAt: null,
      }),
    );
  }

  findPasswordReset(tokenReference: string): Promise<PasswordResetRequestEntity | null> {
    return this.resets.findOne({ where: { tokenReference } });
  }

  async consumePasswordReset(tokenReference: string, consumedAt: Date): Promise<boolean> {
    const result = await this.resets.update(
      {
        tokenReference,
        requestStatus: 'requested',
        expiresAt: MoreThan(consumedAt),
      },
      { requestStatus: 'used', usedAt: consumedAt },
    );
    return result.affected === 1;
  }

  createEmailVerification(input: CreateOneTimeTokenInput): Promise<AccountVerificationEntity> {
    return this.verifications.save(
      this.verifications.create({
        userAccountId: input.userAccountId,
        verificationType: 'email',
        verificationStatus: 'pending',
        tokenReference: input.tokenReference,
        expiresAt: input.expiresAt,
        verifiedAt: null,
      }),
    );
  }

  findEmailVerification(tokenReference: string): Promise<AccountVerificationEntity | null> {
    return this.verifications.findOne({ where: { tokenReference } });
  }

  async consumeEmailVerification(tokenReference: string, consumedAt: Date): Promise<boolean> {
    const result = await this.verifications.update(
      {
        tokenReference,
        verificationStatus: 'pending',
        expiresAt: MoreThan(consumedAt),
      },
      { verificationStatus: 'verified', verifiedAt: consumedAt },
    );
    return result.affected === 1;
  }

  recordLoginAttempt(input: RecordLoginAttemptInput): Promise<LoginAttemptEntity> {
    return this.attempts.save(
      this.attempts.create({
        userAccountId: input.userAccountId ?? null,
        identifierHash: input.identifierHash,
        ipHash: input.ipHash ?? null,
        userAgentFamily: input.userAgentFamily ?? null,
        attemptStatus: input.status,
        failureReason: input.failureReason ?? null,
        attemptedAt: input.attemptedAt,
      }),
    );
  }

  countFailedLoginAttempts(identifierHash: string, since: Date): Promise<number> {
    return this.attempts.count({
      where: {
        identifierHash,
        attemptStatus: 'failed',
        attemptedAt: MoreThan(since),
      },
    });
  }

  async getRoleNames(userAccountId: string): Promise<RoleName[]> {
    const rows = await this.dataSource
      .getRepository(UserRoleAssignmentEntity)
      .createQueryBuilder('assignment')
      .innerJoin(RoleEntity, 'role', 'role.id = assignment.role_id')
      .select('role.role_code', 'roleCode')
      .where('assignment.user_account_id = :userAccountId', { userAccountId })
      .andWhere('assignment.assignment_status = :status', { status: 'active' })
      .andWhere('(assignment.expires_at IS NULL OR assignment.expires_at > :now)', {
        now: new Date(),
      })
      .andWhere('role.role_status = :roleStatus', { roleStatus: 'active' })
      .getRawMany<{ roleCode: RoleName }>();
    return rows.map((row) => row.roleCode);
  }

  async getEffectivePermissions(userAccountId: string): Promise<string[]> {
    const rows = await this.dataSource
      .getRepository(RolePermissionEntity)
      .createQueryBuilder('rolePermission')
      .innerJoin(PermissionEntity, 'permission', 'permission.id = rolePermission.permission_id')
      .innerJoin(UserRoleAssignmentEntity, 'userRole', 'userRole.role_id = rolePermission.role_id')
      .select('DISTINCT permission.permission_code', 'permissionCode')
      .where('userRole.user_account_id = :userAccountId', { userAccountId })
      .andWhere('userRole.assignment_status = :status', { status: 'active' })
      .andWhere('(userRole.expires_at IS NULL OR userRole.expires_at > :now)', {
        now: new Date(),
      })
      .andWhere('rolePermission.assignment_status = :status', { status: 'active' })
      .andWhere('permission.permission_status = :status', { status: 'active' })
      .getRawMany<{ permissionCode: string }>();
    return rows.map((row) => row.permissionCode);
  }
}
