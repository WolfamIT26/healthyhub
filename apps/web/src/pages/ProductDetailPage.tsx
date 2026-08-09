import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Alert, Badge, Breadcrumb, buttonClassName, Button, Card, Divider, ErrorState, IconButton, ProductCard, Skeleton } from '../components';
import { catalogProducts } from '../features/products/catalog.data';
import { dietaryTagLabels, stockStatusLabels, type ProductMediaPresentation, type ProductPresentationModel } from '../features/products/product.types';

type ProductDetailStatus = 'loading' | 'success' | 'error';
const moneyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export function ProductDetailPage({ products = catalogProducts, status = 'success', onRetry }: { products?: ProductPresentationModel[]; status?: ProductDetailStatus; onRetry?: () => void }) {
  const { slug = '' } = useParams();
  const product = products.find((item) => item.slug === slug);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = product ? `${product.name} | HealthyHub` : 'Không tìm thấy sản phẩm | HealthyHub';
    return () => { document.title = previousTitle; };
  }, [product]);

  if (status === 'loading') return <ProductDetailSkeleton />;
  if (status === 'error') return <main className="container flex flex-1 items-center py-16"><ErrorState title="Không thể tải thông tin sản phẩm" description="Nguồn dữ liệu tạm thời chưa sẵn sàng. Vui lòng thử lại." action={<Button type="button" onClick={onRetry}>Thử lại</Button>} /></main>;
  if (!product) return <main className="container flex flex-1 items-center py-16"><ErrorState title="Không tìm thấy sản phẩm" description="Sản phẩm có thể đã được ẩn hoặc đường dẫn không còn hợp lệ." action={<Link to="/products" className={buttonClassName()}>Về danh sách sản phẩm</Link>} /></main>;

  return <ProductDetailContent product={product} products={products} />;
}

function ProductDetailContent({ product, products }: { product: ProductPresentationModel; products: ProductPresentationModel[] }) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stockStatus === 'out_of_stock';
  const relatedProducts = useMemo(() => products.filter((item) => item.id !== product.id && item.category.id === product.category.id).slice(0, 4), [product, products]);
  const visibleBadges = Array.from(new Set([product.discountPercent ? `Giảm ${product.discountPercent}%` : '', ...product.badges])).filter(Boolean).slice(0, 2);

  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm', href: '/products' }, { label: product.category.name, href: `/products?category=${product.category.id}` }, { label: product.name }]} />
        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:gap-12" aria-labelledby="product-title">
          <ProductGallery key={product.id} productName={product.name} media={product.images} fallback={product.visualFallback} />
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">{visibleBadges.map((badge) => <Badge key={badge} tone={badge.startsWith('Giảm') ? 'warning' : 'success'}>{badge}</Badge>)}</div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">{product.brand.name} · {product.category.name}</p>
            <h1 id="product-title" className="mt-2 text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-neutral-500">Mã sản phẩm: {product.sku}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600"><span className="font-semibold text-accent-dark" aria-label={`${product.rating} trên 5 sao`}>★ {product.rating.toFixed(1)}</span><span>{product.reviewCount} đánh giá</span></div>
            <p className="mt-5 text-base leading-7 text-neutral-700">{product.shortDescription}</p>
            <Divider />
            <div className="my-6 flex flex-wrap items-baseline gap-3"><span className="text-3xl font-bold text-primary-700">{moneyFormatter.format(product.price)}</span>{product.originalPrice ? <del className="text-lg text-neutral-500">{moneyFormatter.format(product.originalPrice)}</del> : null}{product.discountPercent ? <Badge tone="warning">Tiết kiệm {product.discountPercent}%</Badge> : null}</div>
            <div className={`rounded-control border px-4 py-3 text-sm font-semibold ${outOfStock ? 'border-error-light bg-error-light/40 text-error-dark' : product.stockStatus === 'low_stock' ? 'border-warning-light bg-warning-light/40 text-warning-dark' : 'border-success-light bg-success-light/40 text-success-dark'}`} role="status">Tình trạng: {stockStatusLabels[product.stockStatus]}</div>
            {product.dietaryTags.length ? <div className="mt-5"><h2 className="text-sm font-bold text-neutral-900">Đặc điểm sản phẩm</h2><div className="mt-2 flex flex-wrap gap-2">{product.dietaryTags.map((tag) => <Badge key={tag} tone="primary">{dietaryTagLabels[tag]}</Badge>)}</div></div> : null}

            <Card className="mt-6" aria-label="Khu vực hành động sản phẩm">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="product-quantity">Số lượng</label>
              <div className="mt-2 flex items-center gap-2">
                <IconButton label="Giảm số lượng" disabled={outOfStock || quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</IconButton>
                <input id="product-quantity" className="h-11 w-16 rounded-control border border-neutral-300 bg-white text-center font-semibold" type="number" min="1" max="10" value={quantity} disabled={outOfStock} onChange={(event) => setQuantity(Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1))))} />
                <IconButton label="Tăng số lượng" disabled={outOfStock || quantity >= 10} onClick={() => setQuantity((value) => Math.min(10, value + 1))}>+</IconButton>
              </div>
              <p id="commerce-foundation-note" className="mt-3 text-sm leading-6 text-neutral-600">Cart và Wishlist chưa được triển khai. Các nút dưới đây chỉ thể hiện UI foundation và không lưu dữ liệu.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button type="button" disabled aria-describedby="commerce-foundation-note">{outOfStock ? 'Hết hàng' : 'Thêm vào giỏ · Sắp ra mắt'}</Button>
                <Button type="button" variant="outline" disabled aria-describedby="commerce-foundation-note">Yêu thích · Sắp ra mắt</Button>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2" aria-label="Thông tin chi tiết sản phẩm">
          <Card><h2 className="text-2xl font-bold text-neutral-950">Mô tả sản phẩm</h2><p className="mt-4 leading-7 text-neutral-700">{product.longDescription ?? product.shortDescription}</p>{product.usageNote ? <><h3 className="mt-6 font-bold text-neutral-900">Hướng dẫn sử dụng</h3><p className="mt-2 leading-7 text-neutral-700">{product.usageNote}</p></> : null}{product.storageNote ? <><h3 className="mt-6 font-bold text-neutral-900">Bảo quản</h3><p className="mt-2 leading-7 text-neutral-700">{product.storageNote}</p></> : null}</Card>
          <Card><h2 className="text-2xl font-bold text-neutral-950">Thành phần và dị ứng</h2>{product.ingredients.length ? <ul className="mt-4 space-y-3">{product.ingredients.map((ingredient) => <li key={ingredient.name}><span className="font-semibold text-neutral-900">{ingredient.name}</span>{ingredient.description ? <span className="text-neutral-600"> — {ingredient.description}</span> : null}</li>)}</ul> : <p className="mt-4 text-neutral-600">Thông tin thành phần chưa có trong dữ liệu presentation.</p>}{product.allergenInformation ? <Alert tone="warning" title="Thông tin dị ứng" className="mt-6">{product.allergenInformation}</Alert> : null}</Card>
        </section>

        {product.nutrition ? <NutritionSection product={product} /> : null}

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-label="Đánh giá và trợ lý AI">
          <Card><h2 className="text-2xl font-bold text-neutral-950">Đánh giá sản phẩm</h2><div className="mt-4 flex flex-wrap items-end gap-3"><span className="text-4xl font-bold text-neutral-950">{product.rating.toFixed(1)}</span><span className="pb-1 text-accent-dark" aria-hidden="true">★★★★★</span><span className="pb-1 text-sm text-neutral-600">Từ {product.reviewCount} lượt đánh giá tổng hợp presentation</span></div><Alert tone="info" className="mt-5">Review API chưa được triển khai nên Product Detail V1 không hiển thị nội dung đánh giá giả.</Alert></Card>
          <Card className="bg-gradient-to-br from-primary-50 to-secondary-100"><p className="text-sm font-bold uppercase tracking-wide text-primary-700">Trợ lý HealthyHub</p><h2 className="mt-2 text-2xl font-bold text-neutral-950">AI có thể giúp bạn đánh giá sản phẩm này</h2><p className="mt-3 text-sm leading-6 text-neutral-700">Tính năng hiện là route foundation, không đưa kết quả AI hoặc lời khuyên y tế giả.</p><div className="mt-5 flex flex-col gap-2 sm:flex-row"><Link to={`/ai?product=${product.slug}`} className={buttonClassName({ className: 'flex-1' })}>Hỏi AI</Link><Link to={`/ai?mode=compare&product=${product.slug}`} className={buttonClassName({ variant: 'outline', className: 'flex-1' })}>So sánh sản phẩm</Link></div></Card>
        </section>

        {relatedProducts.length ? <section className="mt-12 pb-12" aria-labelledby="related-products-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wide text-primary-700">Cùng danh mục</p><h2 id="related-products-title" className="mt-2 text-3xl font-bold text-neutral-950">Sản phẩm liên quan</h2></div><Link to={`/products?category=${product.category.id}`} className={buttonClassName({ variant: 'ghost' })}>Xem danh mục</Link></div><div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((related) => <ProductCard key={related.id} name={related.name} category={related.brand.name} price={moneyFormatter.format(related.price)} originalPrice={related.originalPrice ? moneyFormatter.format(related.originalPrice) : undefined} imageUrl={related.thumbnail ?? undefined} imageFallback={related.visualFallback} details={<span>{stockStatusLabels[related.stockStatus]}</span>} action={<Link to={`/products/${related.slug}`} aria-label={`Xem chi tiết ${related.name}`} className={buttonClassName({ variant: 'outline', className: 'w-full' })}>Xem chi tiết</Link>} />)}</div></section> : null}
      </div>
    </main>
  );
}

function ProductGallery({ productName, media, fallback }: { productName: string; media: ProductMediaPresentation[]; fallback: string }) {
  const gallery = media.length ? media : [{ id: 'fallback', src: null, alt: `Minh họa ${productName}`, label: 'Hình minh họa', visualFallback: fallback }];
  const [activeId, setActiveId] = useState(gallery[0].id);
  const active = gallery.find((item) => item.id === activeId) ?? gallery[0];
  return <div className="min-w-0"><div className="aspect-square overflow-hidden rounded-modal border border-neutral-200 bg-gradient-to-br from-primary-50 via-white to-accent-light shadow-soft">{active.src ? <img src={active.src} alt={active.alt} className="h-full w-full object-contain transition-standard hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100" width="720" height="720" fetchPriority="high" /> : <div className="flex h-full flex-col items-center justify-center p-6 text-center" role="img" aria-label={active.alt}><span className="text-8xl sm:text-9xl" aria-hidden="true">{active.visualFallback}</span><span className="mt-5 text-sm font-semibold text-neutral-600">{active.label}</span></div>}</div>{gallery.length > 1 ? <div className="mt-4 grid grid-cols-3 gap-3" aria-label="Thư viện hình sản phẩm">{gallery.map((item) => <button key={item.id} type="button" aria-label={`Xem ${item.label} của ${productName}`} aria-pressed={item.id === active.id} onClick={() => setActiveId(item.id)} className={`aspect-square rounded-card border bg-white p-2 text-3xl transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${item.id === active.id ? 'border-primary ring-2 ring-primary-100' : 'border-neutral-200 hover:border-primary-100'}`}><span aria-hidden="true">{item.visualFallback}</span><span className="mt-1 block text-xs font-semibold text-neutral-600">{item.label}</span></button>)}</div> : null}</div>;
}

function NutritionSection({ product }: { product: ProductPresentationModel }) {
  const nutrition = product.nutrition!;
  const rows = [['Khẩu phần', nutrition.servingSize], ['Năng lượng', nutrition.calories], ['Protein', nutrition.protein], ['Carbohydrate', nutrition.carbohydrates], ['Chất béo', nutrition.fat], ['Đường', nutrition.sugar]].filter((row): row is [string, string] => Boolean(row[1]));
  return <section className="mt-12" aria-labelledby="nutrition-title"><Card><h2 id="nutrition-title" className="text-2xl font-bold text-neutral-950">Thông tin dinh dưỡng</h2><div className="mt-5 overflow-x-auto"><table className="w-full border-collapse text-left"><caption className="sr-only">Thông tin dinh dưỡng của {product.name}</caption><tbody>{rows.map(([label, value]) => <tr key={label} className="border-b border-neutral-200 last:border-0"><th scope="row" className="px-3 py-3 font-semibold text-neutral-800">{label}</th><td className="px-3 py-3 text-right text-neutral-700">{value}</td></tr>)}</tbody></table></div>{nutrition.note ? <Alert tone="info" className="mt-5">{nutrition.note}</Alert> : null}</Card></section>;
}

function ProductDetailSkeleton() {
  return <main className="container flex-1 py-8" aria-label="Đang tải chi tiết sản phẩm" role="status"><div className="grid gap-8 lg:grid-cols-2"><Skeleton className="aspect-square rounded-modal" /><div className="space-y-4"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-12 w-4/5" /><Skeleton className="h-5 w-1/2" /><Skeleton className="h-24 w-full" /><Skeleton className="h-16 w-2/3" /><Skeleton className="h-40 w-full" /></div></div></main>;
}
