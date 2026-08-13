export type WishlistAvailability = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNAVAILABLE';

export interface ServerWishlistItem {
  wishlistItemId: string;
  product: {
    productId: string;
    name: string | null;
    slug: string | null;
    thumbnail: null;
    currentPrice: string | null;
    currency: 'VND';
    availability: WishlistAvailability;
  };
  addedAt: string;
}

export interface ServerWishlist {
  items: ServerWishlistItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface WishlistMutationResult {
  productId: string;
  deleted: true;
}
