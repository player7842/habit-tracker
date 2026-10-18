import { useEffect, useState } from 'react';
import styles from './GoalProgress.module.css';

interface GoalProgressProps {
  current: number;
  goal: number;
}

export function GoalProgress({ current, goal }: GoalProgressProps) {
  const days = Math.min(current, goal);
  const reached = current >= goal;
  const targetPercent = (days / goal) * 100;
  const [shownPercent, setShownPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShownPercent(targetPercent), 60);
    return () => clearTimeout(timer);
  }, [targetPercent]);

  return (
    <div className={`${styles.wrapper} ${reached ? styles.reached : ''}`}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Progreso hacia la meta"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={days}
      >
        <div className={styles.fill} style={{ width: `${shownPercent}%` }} />
      </div>
      <span className={styles.label}>
        {reached ? '¡Meta cumplida!' : `${days} de ${goal} días`}
      </span>
    </div>
  );
}