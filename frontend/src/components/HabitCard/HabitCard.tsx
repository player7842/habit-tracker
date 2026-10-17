import type { TodayHabit } from '../../api/habits';
import { useJustTurnedOn } from '../../hooks/useJustTurnedOn';
import { formatTime } from '../../utils/time';
import { CheckButton } from '../CheckButton/CheckButton';
import { StreakBadge } from '../StreakBadge/StreakBadge';
import styles from './HabitCard.module.css';

interface HabitCardProps {
  habit: TodayHabit;
  onCheck: (habitId: string) => Promise<void>;
}

function getStatusText(habit: TodayHabit): string {
  if (habit.doneToday) return '¡Cumplido hoy!';

  if (habit.deadlineTime && !habit.canCheckIn) {
    return `Se acabó el tiempo (era hasta las ${formatTime(habit.deadlineTime)})`;
  }

  if (habit.deadlineTime) {
    return `Hasta las ${formatTime(habit.deadlineTime)}`;
  }

  return 'Sin hora límite';
}

export function HabitCard({ habit, onCheck }: HabitCardProps) {
  const celebrating = useJustTurnedOn(habit.doneToday);
  const locked = !habit.doneToday && !habit.canCheckIn;

  const cardClasses = [
    styles.card,
    habit.doneToday && styles.done,
    celebrating && styles.celebrate,
  ]
    .filter(Boolean)
    .join(' ');

  const statusClasses = [
    styles.status,
    habit.doneToday && styles.statusDone,
    locked && styles.statusLocked,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClasses}>
      <div className={styles.info}>
        <h3 className={styles.title}>{habit.name}</h3>
        <p className={statusClasses}>{getStatusText(habit)}</p>
      </div>

      <StreakBadge days={habit.currentStreak} />

      <CheckButton
        label={`Marcar «${habit.name}» como cumplido`}
        checked={habit.doneToday}
        disabled={!habit.canCheckIn}
        onCheck={() => onCheck(habit.id)}
      />
    </article>
  );
}