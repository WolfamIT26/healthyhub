import { Link } from 'react-router-dom';

import {
  Badge,
  Breadcrumb,
  Button,
  buttonClassName,
  EmptyState,
  ErrorState,
  ProductCard,
  Skeleton,
} from '../components';
import { catalogProducts } from '../features/products/catalog.data';
import { WishlistButton } from '../features/wishlist/WishlistButton';
import { useWishlist } from '../features/wishlist/WishlistContext';
import type { WishlistAvailability } from '../features/wishlist/wishlist.types';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});
const availabilityLabels: Record<WishlistAvailability, string> = {
  AVAILABLE: 'Còn hàng',
  LOW_STOCK: 'Sắp hết hàng',
  OUT_OF_STOCK: 'Hết hàng',
  UNAVAILABLE: 'Không còn khả dụng',
};

export function WishlistPage() {
  const wishlist = useWishlist();

  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-8 sm:py-10">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Yêu thích' }]} />
        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Tài khoản Customer
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Sản phẩm yêu thích
          </h1>
          <p className="mt-3 text-neutral-600" aria-live="polite">
            {wishlist.items.length} sản phẩm
          </p>
        </div>

        {wishlist.loading ? <WishlistSkeleton /> : null}
        {!wishlist.loading && wishlist.error ? (
          <div className="mt-8">
            <ErrorState
              title="Không thể tải Wishlist"
              description={wishlist.error}
              action={
                <Button type="button" onClick={() => void wishlist.reload()}>
                  Thử lại
                </Button>
              }
            />
          </div>
        ) : null}
        {!wishlist.loading && !wishlist.error && wishlist.items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Bạn chưa có sản phẩm yêu thích."
              description="Khám phá catalog và lưu lại sản phẩm bạn quan tâm."
              action={
                <Link to="/products" className={buttonClassName()}>
                  Khám phá sản phẩm
                </Link>
              }
            />
          </div>
        ) : null}
        {!wishlist.loading && wishlist.items.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.items.map((item) => {
              const catalog = catalogProducts.find(
                (product) => product.id === item.product.productId,
              );
              const name = item.product.name ?? 'Sản phẩm không còn khả dụng';
              const availability = item.product.availability;
              return (
                <ProductCard
                  key={item.wishlistItemId}
                  name={name}
                  category={
                    catalog
                      ? `${catalog.category.name} · ${catalog.brand.name}`
                      : 'Sản phẩm HealthyHub'
                  }
                  price={
                    item.product.currentPrice
                      ? moneyFormatter.format(Number(item.product.currentPrice))
                      : 'Không còn niêm yết'
                  }
                  imageUrl={item.product.thumbnail ?? catalog?.thumbnail ?? undefined}
                  imageFallback={catalog?.visualFallback ?? '♡'}
                  badge={
                    availability === 'OUT_OF_STOCK' || availability === 'UNAVAILABLE' ? (
                      <Badge tone="error">{availabilityLabels[availability]}</Badge>
                    ) : availability === 'LOW_STOCK' ? (
                      <Badge tone="warning">{availabilityLabels[availability]}</Badge>
                    ) : undefined
                  }
                  details={<span>{availabilityLabels[availability]}</span>}
                  action={
                    <div className="grid gap-2">
                      {item.product.slug ? (
                        <Link
                          to={`/products/${item.product.slug}`}
                          className={buttonClassName({ variant: 'outline', className: 'w-full' })}
                        >
                          Xem chi tiết
                        </Link>
                      ) : null}
                      <WishlistButton
                        productId={item.product.productId}
                        productName={name}
                        className="w-full"
                      />
                    </div>
                  }
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function WishlistSkeleton() {
  return (
    <div
      className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Đang tải Wishlist"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-80" />
      ))}
    </div>
  );
}
