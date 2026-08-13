import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager, type Repository } from 'typeorm';

import { CustomerAddressEntity, CustomerProfileEntity } from '../entities';
import { UserAccountEntity } from '../../user/entities';
import type {
  CreateCustomerAddressInput,
  CustomerRepository,
  OwnedCustomerProfile,
  UpdateCustomerAddressInput,
} from './customer.repository';

@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  private readonly addresses: Repository<CustomerAddressEntity>;
  private readonly customers: Repository<CustomerProfileEntity>;
  private readonly users: Repository<UserAccountEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.addresses = dataSource.getRepository(CustomerAddressEntity);
    this.customers = dataSource.getRepository(CustomerProfileEntity);
    this.users = dataSource.getRepository(UserAccountEntity);
  }

  async findOwnedProfile(
    customerProfileId: string,
    userAccountId: string,
  ): Promise<OwnedCustomerProfile | null> {
    const [profile, account] = await Promise.all([
      this.customers.findOne({
        where: { id: customerProfileId, userAccountId, customerStatus: 'active' },
      }),
      this.users.findOne({ where: { id: userAccountId } }),
    ]);
    return profile && account ? { profile, account } : null;
  }

  updateOwnedProfile(
    customerProfileId: string,
    userAccountId: string,
    fullName: string,
    phone: string | null,
  ): Promise<OwnedCustomerProfile | null> {
    return this.dataSource.transaction(async (manager) => {
      const profiles = manager.getRepository(CustomerProfileEntity);
      const users = manager.getRepository(UserAccountEntity);
      const profile = await profiles.findOne({
        where: { id: customerProfileId, userAccountId, customerStatus: 'active' },
        lock: { mode: 'pessimistic_write' },
      });
      const account = await users.findOne({
        where: { id: userAccountId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!profile || !account) return null;

      profile.fullName = fullName;
      profile.contactInfo = { email: account.email, ...(phone ? { phone } : {}) };
      profile.updatedBy = userAccountId;
      account.displayName = fullName;
      account.phone = phone;
      account.updatedBy = userAccountId;
      await users.save(account);
      await profiles.save(profile);
      return { profile, account };
    });
  }

  listActiveAddresses(customerProfileId: string): Promise<CustomerAddressEntity[]> {
    return this.addresses.find({
      where: { customerProfileId, addressStatus: 'active' },
      order: { isDefault: 'DESC', updatedAt: 'DESC', id: 'DESC' },
    });
  }

  findAddressByIdempotency(
    customerProfileId: string,
    idempotencyKeyHash: string,
  ): Promise<CustomerAddressEntity | null> {
    return this.addresses.findOne({
      where: { customerProfileId, idempotencyKeyHash },
      withDeleted: true,
    });
  }

  createAddress(input: CreateCustomerAddressInput): Promise<CustomerAddressEntity> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(CustomerAddressEntity);
      const existing = await repository.findOne({
        where: {
          customerProfileId: input.customerProfileId,
          idempotencyKeyHash: input.idempotencyKeyHash,
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (existing) return existing;

      const active = await this.lockActiveAddresses(manager, input.customerProfileId);
      const isDefault = input.isDefault || active.length === 0;
      if (isDefault) await this.clearDefault(manager, input.customerProfileId, input.userAccountId);
      return repository.save(
        repository.create({
          tenantId: '1',
          customerProfileId: input.customerProfileId,
          recipientName: input.recipientName,
          phone: input.phone,
          countryCode: input.countryCode,
          provinceCity: input.provinceCity,
          district: input.district,
          ward: input.ward,
          addressLine: input.addressLine,
          note: input.note,
          isDefault,
          addressStatus: 'active',
          idempotencyKeyHash: input.idempotencyKeyHash,
          requestHash: input.requestHash,
          createdBy: input.userAccountId,
          updatedBy: input.userAccountId,
        }),
      );
    });
  }

  updateAddress(input: UpdateCustomerAddressInput): Promise<CustomerAddressEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(CustomerAddressEntity);
      await this.lockActiveAddresses(manager, input.customerProfileId);
      const address = await repository.findOne({
        where: {
          id: input.addressId,
          customerProfileId: input.customerProfileId,
          addressStatus: 'active',
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (!address) return null;
      if (input.isDefault) {
        await this.clearDefault(manager, input.customerProfileId, input.userAccountId);
      }
      Object.assign(address, {
        recipientName: input.recipientName,
        phone: input.phone,
        countryCode: input.countryCode,
        provinceCity: input.provinceCity,
        district: input.district,
        ward: input.ward,
        addressLine: input.addressLine,
        note: input.note,
        isDefault: input.isDefault || address.isDefault,
        updatedBy: input.userAccountId,
      });
      return repository.save(address);
    });
  }

  archiveAddress(
    customerProfileId: string,
    userAccountId: string,
    addressId: string,
  ): Promise<CustomerAddressEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(CustomerAddressEntity);
      const address = await repository
        .createQueryBuilder('address')
        .withDeleted()
        .setLock('pessimistic_write')
        .where('address.id = :addressId', { addressId })
        .andWhere('address.customerProfileId = :customerProfileId', { customerProfileId })
        .getOne();
      if (!address) return null;
      if (address.deletedAt || address.addressStatus === 'archived') return address;

      const wasDefault = address.isDefault;
      address.addressStatus = 'archived';
      address.isDefault = false;
      address.deletedAt = new Date();
      address.deletedBy = userAccountId;
      address.updatedBy = userAccountId;
      await repository.save(address);

      if (wasDefault) {
        const remaining = await repository.find({
          where: { customerProfileId, addressStatus: 'active' },
          order: { updatedAt: 'DESC', id: 'DESC' },
          lock: { mode: 'pessimistic_write' },
        });
        const nextDefault = remaining[0];
        if (nextDefault) {
          nextDefault.isDefault = true;
          nextDefault.updatedBy = userAccountId;
          await repository.save(nextDefault);
        }
      }
      return address;
    });
  }

  private lockActiveAddresses(
    manager: EntityManager,
    customerProfileId: string,
  ): Promise<CustomerAddressEntity[]> {
    return manager.getRepository(CustomerAddressEntity).find({
      where: { customerProfileId, addressStatus: 'active' },
      order: { id: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
  }

  private async clearDefault(
    manager: EntityManager,
    customerProfileId: string,
    userAccountId: string,
  ): Promise<void> {
    await manager
      .getRepository(CustomerAddressEntity)
      .createQueryBuilder()
      .update(CustomerAddressEntity)
      .set({ isDefault: false, updatedBy: userAccountId })
      .where('customer_profile_id = :customerProfileId', { customerProfileId })
      .andWhere('address_status = :status', { status: 'active' })
      .andWhere('deleted_at IS NULL')
      .execute();
  }
}
