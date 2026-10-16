import { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import styles from './CheckButton.module.css';

interface CheckButtonProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  onCheck: () => Promise<void> | void;
}

export function CheckButton({
  checked,
  label,
  disabled = false,
  onCheck,
}: CheckButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (checked || disabled || pending) return;

    setPending(true);
    try {
      await onCheck();
      celebrate();
    } catch {
      // Si falla, no se celebra: quien usa el botón muestra el error.
    } finally {
      setPending(false);
    }
  }

  function celebrate() {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    confetti({
      particleCount: 40,
      spread: 70,
      startVelocity: 25,
      scalar: 0.8,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#7aa7ff', '#5eead4', '#ffcf75', '#e8eefc'],
    });

    navigator.vibrate?.(25);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.button} ${checked ? styles.checked : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={checked}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </button>
  );
}