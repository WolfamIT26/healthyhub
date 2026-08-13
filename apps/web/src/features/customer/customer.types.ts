export interface CustomerProfile {
  fullName: string;
  email: string;
  phone: string | null;
  updatedAt: string;
}

export interface CustomerProfileUpdate {
  fullName?: string;
  phone?: string | null;
}

export interface CustomerAddress {
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

export interface CustomerAddressInput {
  recipientName: string;
  phone: string;
  countryCode: 'VN';
  provinceCity: string;
  district: string;
  ward?: string;
  addressLine: string;
  note?: string;
  isDefault?: boolean;
}
