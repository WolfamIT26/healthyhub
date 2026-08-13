import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoleName } from '@healthyhub/shared-types';

import type { CustomerAddressEntity, CustomerProfileEntity } from '../../data/customer/entities';
import type { CustomerRepository } from '../../data/customer/repositories';
import type { UserAccountEntity } from '../../data/user/entities';
import { CustomerOwnerResolver } from '../../domain/commerce-dependencies/customer-owner.resolver';
import { ShippingQuoteService } from '../../domain/shipping/shipping-quote.service';
import { CustomerService } from './customer.service';

const now = new Date('2026-08-13T00:00:00.000Z');
const profile = {
  id: '7',
  userAccountId: '42',
  fullName: 'Nguyễn Văn A',
  contactInfo: { email: 'customer@example.test', phone: '0901234567' },
  updatedAt: now,
} as CustomerProfileEntity;
const account = {
  id: '42',
  email: 'customer@example.test',
  phone: '0901234567',
  displayName: 'Nguyễn Văn A',
} as UserAccountEntity;
const address = {
  id: '11',
  customerProfileId: '7',
  recipientName: 'Nguyễn Văn A',
  phone: '0901234567',
  countryCode: 'VN',
  provinceCity: 'Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Bến Nghé',
  addressLine: '12 Nguyễn Huệ',
  note: null,
  isDefault: true,
  requestHash: null,
  updatedAt: now,
} as CustomerAddressEntity;

function repository(): CustomerRepository {
  return {
    findOwnedProfile: vi.fn().mockResolvedValue({ profile, account }),
    updateOwnedProfile: vi.fn().mockResolvedValue({
      profile: {
        ...profile,
        fullName: 'Nguyễn Văn B',
        contactInfo: { ...profile.contactInfo, phone: '0912345678' },
      },
      account: { ...account, displayName: 'Nguyễn Văn B', phone: '0912345678' },
    }),
    listActiveAddresses: vi.fn().mockResolvedValue([address]),
    findAddressByIdempotency: vi.fn().mockResolvedValue(null),
    createAddress: vi.fn().mockImplementation(async (input) => ({
      ...address,
      ...input,
      requestHash: input.requestHash,
    })),
    updateAddress: vi.fn().mockResolvedValue({ ...address, addressLine: '34 Lê Lợi' }),
    archiveAddress: vi.fn().mockResolvedValue({ ...address, addressStatus: 'archived' }),
  };
}

function actor(userAccountId = '42', roles: RoleName[] = ['CUSTOMER']) {
  return {
    userAccountId,
    sessionId: '1',
    sessionPublicId: 'session-1',
    roles: [...roles],
    permissionsVersion: 1,
  };
}

describe('CustomerService', () => {
  let data: CustomerRepository;
  let service: CustomerService;

  beforeEach(() => {
    data = repository();
    const owners = new CustomerOwnerResolver({
      findActiveByUserAccountId: vi
        .fn()
        .mockImplementation(async (userAccountId) => (userAccountId === '42' ? profile : null)),
    });
    service = new CustomerService(data, owners, new ShippingQuoteService());
  });

  it('loads only the authenticated Customer profile and keeps email read-only', async () => {
    await expect(service.getProfile(actor())).resolves.toEqual({
      fullName: 'Nguyễn Văn A',
      email: 'customer@example.test',
      phone: '0901234567',
      updatedAt: now.toISOString(),
    });
    expect(data.findOwnedProfile).toHaveBeenCalledWith('7', '42');
  });

  it('updates only approved profile fields for the resolved owner', async () => {
    await expect(
      service.updateProfile(actor(), 'profile-update-1', {
        fullName: 'Nguyễn Văn B',
        phone: '0912345678',
      }),
    ).resolves.toMatchObject({ fullName: 'Nguyễn Văn B', phone: '0912345678' });
    expect(data.updateOwnedProfile).toHaveBeenCalledWith('7', '42', 'Nguyễn Văn B', '0912345678');
  });

  it('rejects Internal actors and a Customer without an owned profile', async () => {
    await expect(service.getProfile(actor('42', ['STAFF']))).rejects.toMatchObject({
      status: 403,
    });
    await expect(service.getProfile(actor('99'))).rejects.toMatchObject({ status: 404 });
  });

  it('lists, creates, updates and soft-deletes owner-scoped addresses', async () => {
    await expect(service.listAddresses(actor())).resolves.toMatchObject([
      { addressId: '11', isDefault: true },
    ]);
    const input = {
      recipientName: 'Nguyễn Văn A',
      phone: '0901234567',
      countryCode: 'VN' as const,
      provinceCity: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      addressLine: '12 Nguyễn Huệ',
      isDefault: true,
    };
    await expect(service.createAddress(actor(), 'address-create-1', input)).resolves.toMatchObject({
      addressId: '11',
      countryCode: 'VN',
    });
    await expect(
      service.updateAddress(actor(), '11', 'address-update-1', {
        addressLine: '34 Lê Lợi',
        isDefault: true,
      }),
    ).resolves.toMatchObject({ addressLine: '34 Lê Lợi' });
    await expect(service.deleteAddress(actor(), '11', 'address-delete-1')).resolves.toEqual({
      addressId: '11',
      deleted: true,
    });
    expect(data.updateAddress).toHaveBeenCalledWith(
      expect.objectContaining({ customerProfileId: '7', addressId: '11' }),
    );
    expect(data.archiveAddress).toHaveBeenCalledWith('7', '42', '11');
  });

  it('isolates another Customer address as not found', async () => {
    vi.mocked(data.listActiveAddresses).mockResolvedValue([]);

    await expect(
      service.updateAddress(actor(), '88', 'address-update-2', {
        addressLine: 'Không thuộc owner',
      }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('deduplicates Address create and rejects conflicting key reuse', async () => {
    const input = {
      recipientName: address.recipientName,
      phone: address.phone,
      countryCode: 'VN' as const,
      provinceCity: address.provinceCity,
      district: address.district,
      ward: address.ward ?? undefined,
      addressLine: address.addressLine,
      isDefault: true,
    };
    await service.createAddress(actor(), 'address-create-2', input);
    const created = vi.mocked(data.createAddress).mock.calls[0][0];
    vi.mocked(data.findAddressByIdempotency).mockResolvedValue({
      ...address,
      requestHash: created.requestHash,
    });
    await expect(service.createAddress(actor(), 'address-create-2', input)).resolves.toMatchObject({
      addressId: '11',
    });
    await expect(
      service.createAddress(actor(), 'address-create-2', { ...input, district: 'Quận 3' }),
    ).rejects.toMatchObject({ status: 409 });
  });
});
