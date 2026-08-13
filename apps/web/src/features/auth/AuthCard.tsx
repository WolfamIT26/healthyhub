import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, FormField, Input } from '../../components';
import { authAssets } from './authAssets';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="auth-page">
      <img
        className="auth-background"
        src={authAssets.authenticationBanner}
        alt=""
        width="1536"
        height="1024"
        fetchPriority="high"
      />
      <div className="auth-background-overlay" aria-hidden="true" />
      <div className="auth-card-frame">
        <Card surface="plain" className="auth-card" aria-labelledby="auth-title">
          <Link to="/" className="auth-brand" aria-label="HealthyHub - Về trang chủ">
            <img src={authAssets.logoSymbol} alt="" width="48" height="48" />
            <span>HealthyHub</span>
          </Link>
          <h1 id="auth-title">{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </Card>
      </div>
    </main>
  );
}

export function AuthForm({
  onSubmit,
  children,
}: {
  onSubmit(event: FormEvent<HTMLFormElement>): void;
  children: ReactNode;
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {children}
    </form>
  );
}

export function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange(value: string): void;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <FormField id={id} label={label} error={error}>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        error={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FormField>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <Button className="mt-1 w-full" type="submit" loading={pending}>
      {children}
    </Button>
  );
}

export function FormAlert({
  children,
  tone = 'error',
}: {
  children: ReactNode;
  tone?: 'error' | 'success' | 'info';
}) {
  return (
    <Alert className="mb-4" tone={tone}>
      {children}
    </Alert>
  );
}

export function StateIllustration({ src, alt }: { src: string; alt: string }) {
  return <img className="auth-state-illustration" src={src} alt={alt} loading="lazy" />;
}
