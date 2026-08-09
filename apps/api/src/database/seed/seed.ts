import dataSource from '../data-source';
import { seedAuthenticationFoundation } from './authentication-foundation.seed';
import { seedCartCommerceDevelopment } from './cart-commerce-development.seed';

async function seed(): Promise<void> {
  await dataSource.initialize();
  try {
    await dataSource.transaction(async (manager) => {
      await seedAuthenticationFoundation(manager);
      if ((process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development') === 'development') {
        await seedCartCommerceDevelopment(manager);
      }
    });
    console.log('Authentication foundation and development commerce fixtures seeded.');
  } finally {
    await dataSource.destroy();
  }
}

void seed();
