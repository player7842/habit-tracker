import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface FieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  label: string;
}

export function Field({ label, type = 'text', ...inputProps }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.control}>
        <input
          {...inputProps}
          id={id}
          type={isPassword && visible ? 'text' : type}
          className={`${styles.input} ${isPassword ? styles.withToggle : ''}`}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
          >
            <EyeIcon crossed={visible} />
          </button>
        )}
      </div>
    </div>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      {crossed && <path d="M4 4l16 16" />}
    </svg>
  );
}