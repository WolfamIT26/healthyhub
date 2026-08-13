export type CartAvailability =
  | 'AVAILABLE'
  | 'LOW_STOCK'
  | 'INSUFFICIENT_STOCK'
  | 'OUT_OF_STOCK'
  | 'UNAVAILABLE'
  | 'INVALID_QUANTITY';

export interface ServerCartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  thumbnail: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  currency: 'VND';
  availability: CartAvailability;
  availableQuantity: number | null;
}

export interface ServerCart {
  id: string;
  status: 'active';
  validationStatus: 'valid' | 'invalid' | 'not_validated';
  itemCount: number;
  items: ServerCartItem[];
  subtotal: string;
  currency: 'VND';
  isValid: boolean;
  updatedAt: string;
}
