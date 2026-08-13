import type { CustomerAddressEntity, CustomerProfileEntity } from '../entities';
import type { UserAccountEntity } from '../../user/entities';

export interface OwnedCustomerProfile {
  profile: CustomerProfileEntity;
  account: UserAccountEntity;
}

export interface CustomerAddressValues {
  recipientName: string;
  phone: string;
  countryCode: 'VN';
  provinceCity: string;
  district: string;
  ward: string | null;
  addressLine: string;
  note: string | null;
}

export interface CreateCustomerAddressInput extends CustomerAddressValues {
  customerProfileId: string;
  userAccountId: string;
  isDefault: boolean;
  idempotencyKeyHash: string;
  requestHash: string;
}

export interface UpdateCustomerAddressInput extends CustomerAddressValues {
  customerProfileId: string;
  userAccountId: string;
  addressId: string;
  isDefault: boolean;
}

export interface CustomerRepository {
  findOwnedProfile(
    customerProfileId: string,
    userAccountId: string,
  ): Promise<OwnedCustomerProfile | null>;
  updateOwnedProfile(
    customerProfileId: string,
    userAccountId: string,
    fullName: string,
    phone: string | null,
  ): Promise<OwnedCustomerProfile | null>;
  listActiveAddresses(customerProfileId: string): Promise<CustomerAddressEntity[]>;
  findAddressByIdempotency(
    customerProfileId: string,
    idempotencyKeyHash: string,
  ): Promise<CustomerAddressEntity | null>;
  createAddress(input: CreateCustomerAddressInput): Promise<CustomerAddressEntity>;
  updateAddress(input: UpdateCustomerAddressInput): Promise<CustomerAddressEntity | null>;
  archiveAddress(
    customerProfileId: string,
    userAccountId: string,
    addressId: string,
  ): Promise<CustomerAddressEntity | null>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
