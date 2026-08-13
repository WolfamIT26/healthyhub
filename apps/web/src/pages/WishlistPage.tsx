import { Link } from 'react-router-dom';

import { Badge, Breadcrumb, buttonClassName, EmptyState, ProductCard } from '../components';
import { catalogProducts } from '../features/products/catalog.data';
import { stockStatusLabels } from '../features/products/product.types';
import { WishlistButton } from '../features/wishlist/WishlistButton';
import { useWishlist } from '../features/wishlist/WishlistContext';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function WishlistPage() {
  const wishlist = useWishlist();
  const products = wishlist.productIds
    .map((id) => catalogProducts.find((product) => product.id === id))
    .filter((product) => product !== undefined);

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
            {products.length} sản phẩm
          </p>
        </div>
        <p className="mt-5 rounded-control border border-warning-light bg-warning-light/40 px-4 py-3 text-sm leading-6 text-warning-dark">
          Wishlist V1 hiện chỉ giữ state tạm thời trong bộ nhớ giao diện và sẽ mất khi tải lại
          trang. Server persistence đang chờ executable backend contract.
        </p>
        {products.length === 0 ? (
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
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={`${product.category.name} · ${product.brand.name}`}
                price={moneyFormatter.format(product.price)}
                originalPrice={
                  product.originalPrice ? moneyFormatter.format(product.originalPrice) : undefined
                }
                imageUrl={product.thumbnail ?? undefined}
                imageFallback={product.visualFallback}
                badge={
                  product.stockStatus === 'out_of_stock' ? (
                    <Badge tone="error">{stockStatusLabels[product.stockStatus]}</Badge>
                  ) : undefined
                }
                details={<span>{stockStatusLabels[product.stockStatus]}</span>}
                action={
                  <div className="grid gap-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className={buttonClassName({ variant: 'outline', className: 'w-full' })}
                    >
                      Xem chi tiết
                    </Link>
                    <WishlistButton
                      productId={product.id}
                      productName={product.name}
                      className="w-full"
                    />
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
