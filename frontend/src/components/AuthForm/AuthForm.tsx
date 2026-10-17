import type { FormEvent, ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  isSubmitting: boolean;
  error: string | null;
  footer: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  isSubmitting,
  error,
  footer,
  onSubmit,
  children,
}: AuthFormProps) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <form className={styles.form} onSubmit={onSubmit}>
          {children}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Un momento…' : submitLabel}
          </Button>
        </form>

        <p className={styles.footer}>{footer}</p>
      </div>
    </main>
  );
}