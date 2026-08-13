import type { ReactNode } from 'react';

export function Breadcrumb({ items }: { items: Array<{ label: ReactNode; href?: string }> }) {
  return (
    <nav aria-label="Đường dẫn trang">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index ? <span aria-hidden="true">/</span> : null}
            {item.href && index < items.length - 1 ? (
              <a
                className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span
                aria-current={index === items.length - 1 ? 'page' : undefined}
                className={
                  index === items.length - 1 ? 'font-semibold text-neutral-900' : undefined
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
