import { useId, type HTMLAttributes, type ReactNode } from 'react';

import { Button } from '../ui/Button';
import { cn } from '../ui/cn';

export function Divider({ label }: { label?: ReactNode }) { return <div className="flex items-center gap-3" role="separator"><span className="h-px flex-1 bg-neutral-200" />{label ? <span className="text-xs text-neutral-500">{label}</span> : null}<span className="h-px flex-1 bg-neutral-200" /></div>; }

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' }) {
  const tones = { neutral: 'bg-neutral-100 text-neutral-700', primary: 'bg-primary-100 text-primary-700', success: 'bg-success-light text-success-dark', warning: 'bg-warning-light text-warning-dark', error: 'bg-error-light text-error-dark', info: 'bg-info-light text-info-dark' };
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone])}>{children}</span>;
}
export const StatusBadge = Badge;

export function Avatar({ name, src, size = 'md' }: { name: string; src?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm';
  return src ? <img className={cn('rounded-full object-cover', dimensions)} src={src} alt={name} /> : <span className={cn('inline-flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700', dimensions)} aria-label={name}>{name.trim().slice(0, 2).toLocaleUpperCase('vi-VN')}</span>;
}

export function Card({ children, className, surface = 'default', ...props }: HTMLAttributes<HTMLElement> & { surface?: 'default' | 'plain' }) { return <section className={cn(surface === 'default' && 'rounded-card border border-neutral-200 bg-white p-5 shadow-soft', className)} {...props}>{children}</section>; }
export function StatCard({ label, value, detail }: { label: ReactNode; value: ReactNode; detail?: ReactNode }) { return <Card><p className="text-sm text-neutral-600">{label}</p><p className="mt-2 text-2xl font-bold text-neutral-950">{value}</p>{detail ? <div className="mt-2 text-xs text-neutral-500">{detail}</div> : null}</Card>; }
export function ProductCard({ name, category, price, originalPrice, imageUrl, imageFallback, badge, action }: { name: string; category?: string; price: string; originalPrice?: string; imageUrl?: string; imageFallback?: ReactNode; badge?: ReactNode; action?: ReactNode }) { return <Card className="group flex h-full flex-col overflow-hidden p-0 transition-standard hover:-translate-y-1 hover:shadow-medium motion-reduce:hover:translate-y-0"><div className="aspect-square bg-gradient-to-br from-primary-50 via-white to-accent-light">{imageUrl ? <img className="h-full w-full object-cover" src={imageUrl} alt={name} loading="lazy" width="480" height="480" /> : <div className="flex h-full items-center justify-center text-7xl" role="img" aria-label={`Minh họa ${name}`}>{imageFallback ?? '🍃'}</div>}</div><div className="flex flex-1 flex-col p-4">{badge}<div className="flex-1">{category ? <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{category}</p> : null}<h3 className="mt-1 line-clamp-2 font-semibold text-neutral-950">{name}</h3><div className="mt-2 flex flex-wrap items-baseline gap-2"><p className="font-bold text-primary-700">{price}</p>{originalPrice ? <del className="text-sm text-neutral-500">{originalPrice}</del> : null}</div></div>{action ? <div className="mt-4">{action}</div> : null}</div></Card>; }

export function Pagination({ page, pageCount, onPageChange, label = 'Phân trang' }: { page: number; pageCount: number; onPageChange(page: number): void; label?: string }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-1"><Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Trước</Button>{pages.map((item) => <Button key={item} variant={item === page ? 'primary' : 'ghost'} size="sm" aria-current={item === page ? 'page' : undefined} aria-label={`Trang ${item}`} onClick={() => onPageChange(item)}>{item}</Button>)}<Button variant="ghost" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Sau</Button></nav>;
}

export function Tabs({ items, value, onChange }: { items: Array<{ value: string; label: ReactNode; content: ReactNode }>; value: string; onChange(value: string): void }) {
  const id = useId(); const active = items.find((item) => item.value === value) ?? items[0];
  return <div><div role="tablist" className="flex max-w-full gap-1 overflow-x-auto border-b border-neutral-200">{items.map((item) => <button key={item.value} id={`${id}-${item.value}-tab`} role="tab" aria-selected={item.value === active?.value} aria-controls={`${id}-${item.value}-panel`} className={cn('min-h-11 shrink-0 border-b-2 px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', item.value === active?.value ? 'border-primary text-primary-700' : 'border-transparent text-neutral-600')} onClick={() => onChange(item.value)}>{item.label}</button>)}</div>{active ? <div id={`${id}-${active.value}-panel`} role="tabpanel" aria-labelledby={`${id}-${active.value}-tab`} className="py-4">{active.content}</div> : null}</div>;
}

export function Accordion({ items }: { items: Array<{ title: ReactNode; content: ReactNode }> }) { return <div className="divide-y divide-neutral-200 rounded-card border border-neutral-200">{items.map((item, index) => <details key={index} className="group p-4"><summary className="cursor-pointer list-none font-semibold text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{item.title}<span className="float-right transition-standard group-open:rotate-180 motion-reduce:transition-none">⌄</span></summary><div className="pt-3 text-sm leading-6 text-neutral-600">{item.content}</div></details>)}</div>; }

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) { return <span className="group relative inline-flex"><span tabIndex={0}>{children}</span><span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-max max-w-64 -translate-x-1/2 rounded-control bg-neutral-950 px-2 py-1 text-xs text-white shadow-medium group-hover:block group-focus-within:block">{content}</span></span>; }
