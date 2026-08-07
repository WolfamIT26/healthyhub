import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { IconButton } from '../ui/Button';
import { cn } from '../ui/cn';

export function Label({ htmlFor, required, children, className }: { htmlFor?: string; required?: boolean; children: ReactNode; className?: string }) {
  return <label htmlFor={htmlFor} className={cn('text-sm font-semibold text-neutral-800', className)}>{children}{required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : null}</label>;
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return <p id={id} className="text-sm text-error-dark">{children}</p>;
}

export function FormField({ id, label, required, helperText, error, success, children, className }: { id: string; label: ReactNode; required?: boolean; helperText?: ReactNode; error?: ReactNode; success?: ReactNode; children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5', className)}><Label htmlFor={id} required={required}>{label}</Label>{children}{error ? <FieldError id={`${id}-error`}>{error}</FieldError> : success ? <p id={`${id}-success`} className="text-sm text-success-dark" role="status">{success}</p> : helperText ? <p id={`${id}-helper`} className="text-xs leading-5 text-neutral-500">{helperText}</p> : null}</div>;
}

const controlClass = 'min-h-11 w-full rounded-control border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-950 outline-none transition-standard placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error-light motion-reduce:transition-none';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { error?: boolean }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, error, ...props }, ref) {
  return <input ref={ref} className={cn(controlClass, className)} aria-invalid={Boolean(error)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(controlClass, 'min-h-28 resize-y', className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...props }, ref) {
  return <select ref={ref} className={cn(controlClass, className)} {...props}>{children}</select>;
});

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode };
function Choice({ type, label, className, ...props }: ChoiceProps & { type: 'checkbox' | 'radio' }) {
  return <label className={cn('inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-neutral-800', className)}><input type={type} className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary" {...props} /><span>{label}</span></label>;
}
export function Checkbox(props: ChoiceProps) { return <Choice type="checkbox" {...props} />; }
export function Radio(props: ChoiceProps) { return <Choice type="radio" {...props} />; }

export function Switch({ label, checked, onChange, disabled, id }: { label: ReactNode; checked: boolean; onChange(checked: boolean): void; disabled?: boolean; id?: string }) {
  return <div className="inline-flex min-h-11 items-center gap-3 text-sm text-neutral-800"><button id={id} type="button" role="switch" aria-checked={checked} aria-label={typeof label === 'string' ? label : undefined} disabled={disabled} onClick={() => onChange(!checked)} className={cn('relative h-6 w-11 rounded-full transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60', checked ? 'bg-primary' : 'bg-neutral-300')}><span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-standard', checked ? 'left-6' : 'left-1')} /></button><span>{label}</span></div>;
}

export const SearchInput = forwardRef<HTMLInputElement, InputProps & { onClear?: () => void }>(function SearchInput({ className, onClear, value, ...props }, ref) {
  return <div className="relative"><Input ref={ref} type="search" value={value} className={cn('pl-10 pr-11', className)} {...props} /><svg className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 fill-none stroke-neutral-500" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>{onClear && value ? <IconButton label="Xóa nội dung tìm kiếm" className="absolute right-0 top-0" onClick={onClear}>×</IconButton> : null}</div>;
});
