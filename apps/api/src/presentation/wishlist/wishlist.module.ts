import { Module } from '@nestjs/common';

import { WISHLIST_REPOSITORY, TypeOrmWishlistRepository } from '../../data/wishlist/repositories';
import { CommerceDependenciesModule } from '../../domain/commerce-dependencies/commerce-dependencies.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [AuthenticationModule, CommerceDependenciesModule],
  controllers: [WishlistController],
  providers: [
    { provide: WISHLIST_REPOSITORY, useClass: TypeOrmWishlistRepository },
    WishlistService,
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
