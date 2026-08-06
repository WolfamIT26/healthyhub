import dataSource from '../data-source';
import { seedAuthenticationFoundation } from './authentication-foundation.seed';

async function seed(): Promise<void> {
  await dataSource.initialize();
  try {
    await dataSource.transaction(seedAuthenticationFoundation);
    console.log('Authentication role and permission foundation seeded.');
  } finally {
    await dataSource.destroy();
  }
}

void seed();
