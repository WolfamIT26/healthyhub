import { describe, expect, it } from 'vitest';

import type { HealthyHubEnvironment } from '../../config/environment';
import { AuthenticationCrypto } from './authentication.crypto';

const env = {
  authentication: {
    identifierHmacSecret: 'identifier-test-secret-with-sufficient-entropy',
    csrfSecret: 'csrf-test-secret-with-sufficient-entropy',
    argonMemoryCostKib: 19_456,
    argonTimeCost: 2,
    argonParallelism: 1,
  },
} as HealthyHubEnvironment;

describe('AuthenticationCrypto', () => {
  const crypto = new AuthenticationCrypto(env);

  it('normalizes equivalent email identifiers', () => {
    expect(crypto.normalizeEmail('  USER@Example.COM ')).toBe('user@example.com');
  });

  it('enforces length and local common-password denylist', () => {
    expect(crypto.assertPasswordAllowed('short')).toBe(false);
    expect(crypto.assertPasswordAllowed('password1234')).toBe(false);
    expect(crypto.assertPasswordAllowed('một-mật-khẩu-rất-dài')).toBe(true);
  });

  it('rejects account email parts case-insensitively without banning valid symbols', () => {
    expect(crypto.assertPasswordAllowed('Secure-PHAMVIET-2026', 'phamviet@gmail.com')).toBe(false);
    expect(crypto.assertPasswordAllowed('Secure-gmail.com-2026', 'phamviet@gmail.com')).toBe(false);
    expect(crypto.assertPasswordAllowed('Secure-OUTLOOK-2026', 'person@outlook.com')).toBe(false);
    expect(crypto.assertPasswordAllowed('River@Stone-2026', 'phamviet@gmail.com')).toBe(true);
  });

  it('hashes and verifies with Argon2id without exposing plaintext', async () => {
    const digest = await crypto.hashPassword('correct horse battery staple');
    expect(digest).toContain('$argon2id$');
    await expect(crypto.verifyPassword(digest, 'correct horse battery staple')).resolves.toBe(true);
    await expect(crypto.verifyPassword(digest, 'incorrect password')).resolves.toBe(false);
  });

  it('creates and validates signed double-submit CSRF tokens', () => {
    const token = crypto.signCsrf('nonce');
    expect(crypto.verifyCsrf(token)).toBe(true);
    expect(crypto.verifyCsrf(`${token}tampered`)).toBe(false);
  });

  it('uses separate keyed identifier digests and token hashes', () => {
    expect(crypto.identifierDigest('person@example.com')).not.toBe(
      crypto.digest('person@example.com'),
    );
    expect(crypto.identifierDigest('person@example.com')).toBe(
      crypto.identifierDigest('person@example.com'),
    );
  });
});
