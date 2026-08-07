import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { authAssets } from './authAssets';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  banner?: string;
  bannerAlt?: string;
}

export function AuthCard({ title, description, children, footer, banner, bannerAlt = '' }: AuthCardProps) {
  return (
    <main className="auth-page">
      <section className={`auth-shell ${banner ? 'auth-shell-with-banner' : ''}`} aria-labelledby="auth-title">
        <div className="auth-card">
          <Link to="/" className="auth-brand" aria-label="HealthyHub - Về trang chủ">
            <img src={authAssets.logoSymbol} alt="" width="44" height="44" />
            <span>HealthyHub</span>
          </Link>
          <h1 id="auth-title">{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
        {banner ? (
          <div className="auth-visual" aria-hidden={bannerAlt ? undefined : true}>
            <img
              src={banner}
              alt={bannerAlt}
              loading="lazy"
            />
          </div>
        ) : null}
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

export function StateIllustration({ src, alt }: { src: string; alt: string }) {
  return <img className="auth-state-illustration" src={src} alt={alt} loading="lazy" />;
}
