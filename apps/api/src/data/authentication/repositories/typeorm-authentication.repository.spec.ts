import type { DataSource } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';

import { TypeOrmAuthenticationRepository } from './typeorm-authentication.repository';

function createRepositoryHarness() {
  const users = {
    exists: vi.fn(),
  };
  const sessions = {};
  const attempts = {};
  const resets = {};
  const verifications = {};
  const repositories = [users, sessions, attempts, resets, verifications];
  const dataSource = {
    getRepository: vi.fn().mockImplementation(() => repositories.shift()),
  } as unknown as DataSource;

  return { repository: new TypeOrmAuthenticationRepository(dataSource), users };
}

describe('TypeOrmAuthenticationRepository', () => {
  it('checks normalized email through the User-owned account repository', async () => {
    const { repository, users } = createRepositoryHarness();
    users.exists.mockResolvedValue(true);

    await expect(repository.emailExists('customer@example.com')).resolves.toBe(true);
    expect(users.exists).toHaveBeenCalledWith({
      where: { normalizedEmail: 'customer@example.com' },
    });
  });
});
