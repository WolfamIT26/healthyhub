import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { Spinner } from '../feedback/Feedback';
import { cn } from './cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-700',
  secondary: 'bg-secondary text-white hover:bg-secondary-700',
  outline: 'border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
  danger: 'bg-error text-white hover:bg-error-dark',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 py-1.5 text-sm',
  md: 'min-h-11 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-5 py-3 text-base',
};

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none',
    variants[variant],
    sizes[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingLabel = 'Đang xử lý…',
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        buttonClassName({ variant, size, className }),
        'disabled:cursor-not-allowed disabled:opacity-60',
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: ButtonSize;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', className, children, ...props },
  ref,
) {
  const dimensions = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-12 w-12' : 'h-11 w-11';
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-control text-neutral-600 transition-standard hover:bg-neutral-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none',
        dimensions,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
