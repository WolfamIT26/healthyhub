import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../ui/cn';

export function Spinner({ size = 'md', label }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const dimensions = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none',
        dimensions,
      )}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-control bg-neutral-200 motion-reduce:animate-none',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function Progress({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-neutral-600">
        <span>{label}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className="h-full rounded-full bg-primary transition-standard motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export type AlertTone = 'success' | 'warning' | 'error' | 'info';
const alertTone: Record<AlertTone, string> = {
  success: 'border-success-light bg-success-light/40 text-success-dark',
  warning: 'border-warning-light bg-warning-light/40 text-warning-dark',
  error: 'border-error-light bg-error-light/40 text-error-dark',
  info: 'border-info-light bg-info-light/40 text-info-dark',
};
export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('rounded-card border px-4 py-3 text-sm leading-6', alertTone[tone], className)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}

export function StateMessage({
  tone,
  title,
  description,
  action,
}: {
  tone: AlertTone;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-card border border-neutral-200 bg-white p-6 shadow-soft">
      <span
        className={cn(
          'h-2 w-12 rounded-full',
          tone === 'success'
            ? 'bg-success'
            : tone === 'error'
              ? 'bg-error'
              : tone === 'warning'
                ? 'bg-warning'
                : 'bg-info',
        )}
      />
      <div>
        <h2 className="font-semibold text-neutral-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      </div>
      {action}
    </section>
  );
}
export function EmptyState(props: Omit<Parameters<typeof StateMessage>[0], 'tone'>) {
  return <StateMessage tone="info" {...props} />;
}
export function ErrorState(props: Omit<Parameters<typeof StateMessage>[0], 'tone'>) {
  return <StateMessage tone="error" {...props} />;
}
export function SuccessState(props: Omit<Parameters<typeof StateMessage>[0], 'tone'>) {
  return <StateMessage tone="success" {...props} />;
}
