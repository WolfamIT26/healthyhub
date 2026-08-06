import 'reflect-metadata';

import { instanceToPlain } from 'class-transformer';
import { getMetadataArgsStorage } from 'typeorm';
import { describe, expect, it } from 'vitest';

import { UserAccountEntity } from '../../user/entities';
import {
  AccountVerificationEntity,
  AuthenticationSessionEntity,
  LoginAttemptEntity,
  PasswordResetRequestEntity,
} from './index';

describe('authentication entity metadata', () => {
  it('maps the approved tables', () => {
    const tables = getMetadataArgsStorage().tables;
    const tableNameFor = (target: object) => tables.find((table) => table.target === target)?.name;

    expect(tableNameFor(UserAccountEntity)).toBe('user_accounts');
    expect(tableNameFor(AuthenticationSessionEntity)).toBe('authentication_sessions');
    expect(tableNameFor(LoginAttemptEntity)).toBe('login_attempts');
    expect(tableNameFor(PasswordResetRequestEntity)).toBe('password_reset_requests');
    expect(tableNameFor(AccountVerificationEntity)).toBe('account_verifications');
  });

  it('does not select hashes by default', () => {
    const columns = getMetadataArgsStorage().columns;
    const selectOption = (target: object, propertyName: string) =>
      columns.find((column) => column.target === target && column.propertyName === propertyName)
        ?.options.select;

    expect(selectOption(UserAccountEntity, 'passwordHash')).toBe(false);
    expect(selectOption(AuthenticationSessionEntity, 'refreshTokenHash')).toBe(false);
    expect(selectOption(LoginAttemptEntity, 'identifierHash')).toBe(false);
    expect(selectOption(LoginAttemptEntity, 'ipHash')).toBe(false);
    expect(selectOption(PasswordResetRequestEntity, 'tokenReference')).toBe(false);
    expect(selectOption(AccountVerificationEntity, 'tokenReference')).toBe(false);
  });

  it('excludes sensitive hashes during serialization', () => {
    const session = Object.assign(new AuthenticationSessionEntity(), {
      sessionPublicId: '10000000-0000-4000-8000-000000000001',
      refreshTokenHash: 'a'.repeat(64),
    });

    expect(instanceToPlain(session)).toEqual({
      sessionPublicId: '10000000-0000-4000-8000-000000000001',
    });
  });
});
