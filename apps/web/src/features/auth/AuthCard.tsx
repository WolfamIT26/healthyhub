import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthCard({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <Link to="/" className="auth-brand">HealthyHub</Link>
        <h1 id="auth-title">{title}</h1>
        <p className="auth-description">{description}</p>
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </main>
  );
}

export function AuthForm({ onSubmit, children }: { onSubmit(event: FormEvent<HTMLFormElement>): void; children: ReactNode }) {
  return <form className="auth-form" onSubmit={onSubmit} noValidate>{children}</form>;
}

export function AuthField({ id, label, type = 'text', value, onChange, error, autoComplete }: { id: string; label: string; type?: string; value: string; onChange(value: string): void; error?: string; autoComplete?: string }) {
  const errorId = `${id}-error`;
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error ? <p id={errorId} className="field-error">{error}</p> : null}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return <button className="auth-submit" type="submit" disabled={pending}>{pending ? 'Đang xử lý…' : children}</button>;
}

export function FormAlert({ children, tone = 'error' }: { children: ReactNode; tone?: 'error' | 'success' | 'info' }) {
  return <div className={`auth-alert auth-alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}
