import { createHash } from 'node:crypto';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { CustomerAddressEntity } from '../../data/customer/entities';
import {
  CUSTOMER_REPOSITORY,
  type CustomerAddressValues,
  type CustomerRepository,
  type OwnedCustomerProfile,
} from '../../data/customer/repositories';
import {
  CustomerOwnerResolutionError,
  CustomerOwnerResolver,
} from '../../domain/commerce-dependencies/customer-owner.resolver';
import {
  ShippingQuoteService,
  ShippingValidationError,
} from '../../domain/shipping/shipping-quote.service';
import type {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
  UpdateCustomerProfileDto,
} from './customer.dto';
import { CustomerException } from './customer.exception';

export interface CustomerProfileReadModel {
  fullName: string;
  email: string;
  phone: string | null;
  updatedAt: string;
}

export interface CustomerAddressReadModel {
  addressId: string;
  recipientName: string;
  phone: string;
  countryCode: 'VN';
  provinceCity: string;
  district: string;
  ward: string | null;
  addressLine: string;
  note: string | null;
  isDefault: boolean;
  updatedAt: string;
}

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private readonly repository: CustomerRepository,
    private readonly owners: CustomerOwnerResolver,
    private readonly shipping: ShippingQuoteService,
  ) {}

  async getProfile(auth: AuthenticatedRequestContext): Promise<CustomerProfileReadModel> {
    const owned = await this.ownedProfile(auth);
    return this.profileReadModel(owned);
  }

  async updateProfile(
    auth: AuthenticatedRequestContext,
    idempotencyKey: string | undefined,
    input: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileReadModel> {
    this.idempotencyKey(idempotencyKey);
    const owned = await this.ownedProfile(auth);
    if (input.fullName === undefined && input.phone === undefined) {
      this.validation('Cần ít nhất một trường hồ sơ được phép cập nhật.');
    }
    const fullName = input.fullName?.trim() ?? owned.profile.fullName;
    const phone =
      input.phone === undefined
        ? (owned.profile.contactInfo?.phone ?? null)
        : optional(input.phone);
    if (!fullName) this.validation('Họ và tên không hợp lệ.');
    const updated = await this.repository.updateOwnedProfile(
      owned.profile.id,
      auth.userAccountId,
      fullName,
      phone,
    );
    if (!updated) this.notFoundProfile();
    return this.profileReadModel(updated);
  }

  async listAddresses(auth: AuthenticatedRequestContext): Promise<CustomerAddressReadModel[]> {
    const owner = await this.resolveOwner(auth);
    return (await this.repository.listActiveAddresses(owner.customerProfileId)).map((address) =>
      this.addressReadModel(address),
    );
  }

  async createAddress(
    auth: AuthenticatedRequestContext,
    idempotencyKey: string | undefined,
    input: CreateCustomerAddressDto,
  ): Promise<CustomerAddressReadModel> {
    const key = this.idempotencyKey(idempotencyKey);
    const owner = await this.resolveOwner(auth);
    const values = this.addressValues(input);
    const idempotencyKeyHash = hash(key);
    const requestHash = hash(JSON.stringify({ ...values, isDefault: input.isDefault === true }));
    const existing = await this.repository.findAddressByIdempotency(
      owner.customerProfileId,
      idempotencyKeyHash,
    );
    if (existing) return this.resolveIdempotentAddress(existing, requestHash);
    try {
      return this.resolveIdempotentAddress(
        await this.repository.createAddress({
          ...values,
          customerProfileId: owner.customerProfileId,
          userAccountId: auth.userAccountId,
          isDefault: input.isDefault === true,
          idempotencyKeyHash,
          requestHash,
        }),
        requestHash,
      );
    } catch (error) {
      const raced = await this.repository.findAddressByIdempotency(
        owner.customerProfileId,
        idempotencyKeyHash,
      );
      if (raced) return this.resolveIdempotentAddress(raced, requestHash);
      throw error;
    }
  }

  async updateAddress(
    auth: AuthenticatedRequestContext,
    addressId: string,
    idempotencyKey: string | undefined,
    input: UpdateCustomerAddressDto,
  ): Promise<CustomerAddressReadModel> {
    this.idempotencyKey(idempotencyKey);
    const owner = await this.resolveOwner(auth);
    const current = (await this.repository.listActiveAddresses(owner.customerProfileId)).find(
      (address) => address.id === addressId,
    );
    if (!current) this.notFoundAddress();
    if (!Object.values(input).some((value) => value !== undefined)) {
      this.validation('Cần ít nhất một trường địa chỉ được phép cập nhật.');
    }
    const values = this.addressValues({
      recipientName: input.recipientName ?? current.recipientName,
      phone: input.phone ?? current.phone,
      countryCode: input.countryCode ?? current.countryCode,
      provinceCity: input.provinceCity ?? current.provinceCity,
      district: input.district ?? current.district,
      ward: input.ward === undefined ? (current.ward ?? undefined) : (input.ward ?? undefined),
      addressLine: input.addressLine ?? current.addressLine,
      note: input.note === undefined ? (current.note ?? undefined) : (input.note ?? undefined),
    });
    const updated = await this.repository.updateAddress({
      ...values,
      customerProfileId: owner.customerProfileId,
      userAccountId: auth.userAccountId,
      addressId,
      isDefault: input.isDefault === true || current.isDefault,
    });
    if (!updated) this.notFoundAddress();
    return this.addressReadModel(updated);
  }

  async deleteAddress(
    auth: AuthenticatedRequestContext,
    addressId: string,
    idempotencyKey: string | undefined,
  ): Promise<{ addressId: string; deleted: true }> {
    this.idempotencyKey(idempotencyKey);
    const owner = await this.resolveOwner(auth);
    const archived = await this.repository.archiveAddress(
      owner.customerProfileId,
      auth.userAccountId,
      addressId,
    );
    if (!archived) this.notFoundAddress();
    return { addressId, deleted: true };
  }

  private async ownedProfile(auth: AuthenticatedRequestContext): Promise<OwnedCustomerProfile> {
    const owner = await this.resolveOwner(auth);
    const profile = await this.repository.findOwnedProfile(
      owner.customerProfileId,
      auth.userAccountId,
    );
    if (!profile) this.notFoundProfile();
    return profile;
  }

  private async resolveOwner(auth: AuthenticatedRequestContext) {
    try {
      return await this.owners.resolve(auth);
    } catch (error) {
      if (error instanceof CustomerOwnerResolutionError) {
        if (error.code === 'CUSTOMER_ROLE_REQUIRED') {
          throw new CustomerException(
            HttpStatus.FORBIDDEN,
            'PERMISSION.CUSTOMER.OWNER_REQUIRED',
            'PERMISSION',
            'Khu vực tài khoản chỉ dành cho Customer.',
          );
        }
        this.notFoundProfile();
      }
      throw error;
    }
  }

  private addressValues(input: {
    recipientName: string;
    phone: string;
    countryCode: string;
    provinceCity: string;
    district: string;
    ward?: string;
    addressLine: string;
    note?: string;
  }): CustomerAddressValues {
    try {
      const snapshot = this.shipping.createAddressSnapshot(input);
      if (snapshot.countryCode !== 'VN') this.validation('Địa chỉ nhận hàng không hợp lệ.');
      return { ...snapshot, countryCode: 'VN' };
    } catch (error) {
      if (error instanceof ShippingValidationError) {
        this.validation('Địa chỉ nhận hàng không hợp lệ.');
      }
      throw error;
    }
  }

  private resolveIdempotentAddress(
    address: CustomerAddressEntity,
    requestHash: string,
  ): CustomerAddressReadModel {
    if (address.requestHash !== requestHash) {
      throw new CustomerException(
        HttpStatus.CONFLICT,
        'CONFLICT.CUSTOMER.IDEMPOTENCY_KEY_REUSED',
        'CONFLICT',
        'Idempotency-Key đã được dùng với nội dung địa chỉ khác.',
      );
    }
    return this.addressReadModel(address);
  }

  private profileReadModel(owned: OwnedCustomerProfile): CustomerProfileReadModel {
    return {
      fullName: owned.profile.fullName,
      email: owned.account.email,
      phone: owned.profile.contactInfo?.phone ?? owned.account.phone,
      updatedAt: owned.profile.updatedAt.toISOString(),
    };
  }

  private addressReadModel(address: CustomerAddressEntity): CustomerAddressReadModel {
    return {
      addressId: address.id,
      recipientName: address.recipientName,
      phone: address.phone,
      countryCode: address.countryCode,
      provinceCity: address.provinceCity,
      district: address.district,
      ward: address.ward,
      addressLine: address.addressLine,
      note: address.note,
      isDefault: address.isDefault,
      updatedAt: address.updatedAt.toISOString(),
    };
  }

  private idempotencyKey(value: string | undefined): string {
    if (!value || value.length < 8 || value.length > 191 || !/^[A-Za-z0-9._:-]+$/.test(value)) {
      throw new CustomerException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.CUSTOMER.IDEMPOTENCY_KEY_INVALID',
        'VALIDATION',
        'Idempotency-Key không hợp lệ.',
      );
    }
    return value;
  }

  private validation(message: string): never {
    throw new CustomerException(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'VALIDATION.CUSTOMER.INVALID_INPUT',
      'VALIDATION',
      message,
    );
  }

  private notFoundProfile(): never {
    throw new CustomerException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.CUSTOMER.PROFILE_NOT_FOUND',
      'NOT_FOUND',
      'Không tìm thấy hồ sơ Customer.',
    );
  }

  private notFoundAddress(): never {
    throw new CustomerException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.CUSTOMER.ADDRESS_NOT_FOUND',
      'NOT_FOUND',
      'Không tìm thấy địa chỉ.',
    );
  }
}

function optional(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? '';
  return normalized || null;
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
