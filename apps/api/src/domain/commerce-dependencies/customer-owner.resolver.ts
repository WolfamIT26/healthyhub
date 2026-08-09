import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { CustomerProfileEntity } from '../../data/customer/entities';

export interface CustomerOwnerRepository { findActiveByUserAccountId(userAccountId: string): Promise<CustomerProfileEntity | null> }
export const CUSTOMER_OWNER_REPOSITORY = Symbol('CUSTOMER_OWNER_REPOSITORY');

export class CustomerOwnerResolutionError extends Error {
  constructor(public readonly code: 'CUSTOMER_ROLE_REQUIRED' | 'CUSTOMER_PROFILE_NOT_FOUND') { super(code); }
}

@Injectable()
export class CustomerOwnerResolver {
  constructor(@Inject(CUSTOMER_OWNER_REPOSITORY) private readonly repository: CustomerOwnerRepository) {}

  async resolve(auth: AuthenticatedRequestContext): Promise<{ customerProfileId: string; userAccountId: string }> {
    if (!auth.roles.includes('CUSTOMER')) throw new CustomerOwnerResolutionError('CUSTOMER_ROLE_REQUIRED');
    const profile = await this.repository.findActiveByUserAccountId(auth.userAccountId);
    if (!profile) throw new CustomerOwnerResolutionError('CUSTOMER_PROFILE_NOT_FOUND');
    return { customerProfileId: profile.id, userAccountId: auth.userAccountId };
  }
}
