import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Badge, buttonClassName, Card, ProductCard } from '../components';
import {
  aiFeatures,
  featuredProducts,
  homepageArticles,
  homepageAssets,
  homepageCategories,
} from '../features/home/homepage.data';
import { ProductSearch } from '../features/products/ProductSearch';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-3 leading-7 text-neutral-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function HomePage() {
  const [keyword, setKeyword] = useState('');

  return (
    <main className="flex-1 overflow-hidden bg-white">
      <section
        className="relative isolate bg-neutral-950 text-white"
        aria-labelledby="home-hero-title"
      >
        <img
          src={homepageAssets.heroIllustration}
          alt="Không gian HealthyHub với sản phẩm từ hạt và trợ lý AI"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-55 sm:object-[center_48%]"
          width="1672"
          height="941"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/20" />
        <div className="container flex min-h-[620px] items-center py-16 sm:py-20 lg:min-h-[680px]">
          <div className="max-w-2xl">
            <Badge tone="success">Lựa chọn healthy, thông tin rõ ràng</Badge>
            <h1
              id="home-hero-title"
              className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Chọn điều lành mạnh, theo cách dễ dàng hơn
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-100 sm:text-lg">
              Khám phá sản phẩm được chọn lọc, hiểu rõ thông tin và nhận hỗ trợ từ trợ lý AI trong
              phạm vi an toàn.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className={buttonClassName({ size: 'lg', className: 'w-full sm:w-auto' })}
              >
                Khám phá sản phẩm
              </Link>
              <Link
                to="/ai"
                className={buttonClassName({
                  variant: 'outline',
                  size: 'lg',
                  className: 'w-full border-white/70 bg-white/95 sm:w-auto',
                })}
              >
                Khám phá AI
              </Link>
            </div>
            <div className="mt-8 max-w-xl rounded-card bg-white/95 p-3 text-neutral-950 shadow-medium">
              <ProductSearch
                value={keyword}
                onValueChange={setKeyword}
                label="Tìm kiếm sản phẩm từ trang chủ"
                placeholder="Bạn đang tìm sản phẩm nào?"
                showEmptyError
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-20" aria-labelledby="categories-title">
        <SectionHeading
          id="categories-title"
          eyebrow="Danh mục"
          title="Bắt đầu từ điều bạn quan tâm"
          description="Các nhóm dưới đây là dữ liệu trình bày V1 và sẵn sàng thay bằng catalog public khi module Product được triển khai."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {homepageCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Card className="h-full p-4 transition-standard group-hover:-translate-y-1 group-hover:border-primary-100 group-hover:shadow-medium motion-reduce:group-hover:translate-y-0">
                <span className="text-3xl" aria-hidden="true">
                  {category.icon}
                </span>
                <h3 className="mt-3 font-bold text-neutral-950">{category.name}</h3>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{category.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20" aria-labelledby="products-title">
        <div className="container">
          <SectionHeading
            id="products-title"
            eyebrow="Gợi ý hôm nay"
            title="Sản phẩm nổi bật"
            description="Minh họa giao diện bằng dữ liệu trình bày, chưa kết nối Product API hay giỏ hàng."
            action={
              <Link to="/products" className={buttonClassName({ variant: 'ghost' })}>
                Xem tất cả <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category.name}
                price={moneyFormatter.format(product.price)}
                originalPrice={
                  product.originalPrice ? moneyFormatter.format(product.originalPrice) : undefined
                }
                imageFallback={product.visualFallback}
                badge={
                  <Badge tone={product.discountPercent ? 'warning' : 'success'}>
                    {product.discountPercent ? `Giảm ${product.discountPercent}%` : 'Nổi bật'}
                  </Badge>
                }
                action={
                  <Link
                    to={`/products/${product.slug}`}
                    className={buttonClassName({ variant: 'outline', className: 'w-full' })}
                  >
                    Xem sản phẩm
                  </Link>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-20" aria-labelledby="why-title">
        <SectionHeading
          id="why-title"
          eyebrow="Vì sao chọn HealthyHub"
          title="Mua sắm dễ hiểu, lựa chọn có cơ sở"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['✓', 'Sản phẩm chọn lọc', 'Ưu tiên danh mục có nguồn thông tin rõ ràng.'],
            ['≡', 'Thông tin minh bạch', 'Thành phần và lưu ý được trình bày dễ quét.'],
            ['♡', 'Lựa chọn phù hợp', 'Công cụ hỗ trợ bạn thu hẹp điều đang tìm.'],
            ['✦', 'AI hỗ trợ', 'Gợi ý trong phạm vi an toàn, không thay thế chuyên gia.'],
            ['↗', 'Thuận tiện', 'Trải nghiệm nhất quán trên mọi kích thước màn hình.'],
          ].map(([icon, title, description]) => (
            <Card key={title} className="h-full">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700"
                aria-hidden="true"
              >
                {icon}
              </span>
              <h3 className="mt-4 font-bold text-neutral-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="bg-gradient-to-br from-primary-50 via-white to-secondary-100 py-16 sm:py-20"
        aria-labelledby="ai-title"
      >
        <div className="container grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <img
              src={homepageAssets.aiMascot}
              alt="Linh vật trợ lý AI HealthyHub"
              className="mx-auto aspect-[3/2] w-full max-w-xl object-contain"
              width="768"
              height="512"
              loading="lazy"
            />
          </div>
          <div>
            <SectionHeading
              id="ai-title"
              eyebrow="Trợ lý HealthyHub"
              title="AI đồng hành trong từng lựa chọn"
              description="Các tính năng dưới đây là bản xem trước. AI runtime chưa được triển khai trong Homepage V1."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {aiFeatures.map((feature) => (
                <Card key={feature.id} className="bg-white/80 p-4 backdrop-blur-sm">
                  <h3 className="font-bold text-neutral-950">{feature.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">{feature.description}</p>
                </Card>
              ))}
            </div>
            <Link
              to="/ai"
              className={buttonClassName({ size: 'lg', className: 'mt-6 w-full sm:w-auto' })}
            >
              Khám phá trợ lý AI
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-20" aria-labelledby="lifestyle-title">
        <div className="grid items-center gap-8 rounded-modal bg-neutral-950 p-6 text-white shadow-medium sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-100">
              Lối sống lành mạnh
            </p>
            <h2 id="lifestyle-title" className="mt-3 text-3xl font-bold sm:text-4xl">
              Thay đổi nhỏ, duy trì đều đặn
            </h2>
            <p className="mt-4 leading-7 text-neutral-200">
              HealthyHub giúp bạn đọc thông tin dễ hơn, so sánh thuận tiện hơn và xây dựng lựa chọn
              phù hợp với nhịp sống cá nhân.
            </p>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2" aria-label="Lợi ích của nền tảng">
            {[
              'Thông tin dễ quét',
              'Danh mục rõ ràng',
              'Trải nghiệm nhất quán',
              'Hỗ trợ có giới hạn an toàn',
            ].map((item) => (
              <li
                key={item}
                className="flex min-h-12 items-center gap-3 rounded-control bg-white/10 px-4"
              >
                <span className="text-primary-100" aria-hidden="true">
                  ●
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container pb-16 sm:pb-20" aria-labelledby="promotion-title">
        <div className="relative isolate overflow-hidden rounded-modal bg-primary-700 px-6 py-12 text-white shadow-medium sm:px-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(234,179,8,0.35),transparent_35%)]" />
          <div className="max-w-2xl">
            <Badge tone="warning">Ưu đãi V1</Badge>
            <h2 id="promotion-title" className="mt-4 text-3xl font-bold sm:text-4xl">
              Khám phá lựa chọn phù hợp cho tuần mới
            </h2>
            <p className="mt-3 leading-7 text-primary-50">
              Promotion hiện là nội dung trình bày. Giá và ưu đãi thật sẽ do API public cung cấp ở
              module tương ứng.
            </p>
            <Link
              to="/promotions"
              className={buttonClassName({
                variant: 'outline',
                size: 'lg',
                className: 'mt-6 border-white/70 bg-white text-primary-700',
              })}
            >
              Xem khu khuyến mãi
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20" aria-labelledby="blog-title">
        <div className="container">
          <SectionHeading
            id="blog-title"
            eyebrow="Góc kiến thức"
            title="Hiểu hơn để chọn dễ hơn"
            description="Nội dung tham khảo về sản phẩm và lối sống, không phải tư vấn y tế."
            action={
              <Link to="/blog" className={buttonClassName({ variant: 'ghost' })}>
                Xem blog <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {homepageArticles.map((article) => (
              <Card key={article.id} className="flex h-full flex-col">
                <Badge tone="info">{article.tag}</Badge>
                <h3 className="mt-4 text-xl font-bold text-neutral-950">{article.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-neutral-600">{article.summary}</p>
                <Link
                  to={`/blog/${article.id}`}
                  className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Đọc bài viết{' '}
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
