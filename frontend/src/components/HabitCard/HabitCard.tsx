import type { TodayHabit } from '../../api/habits';
import { useJustTurnedOn } from '../../hooks/useJustTurnedOn';
import { formatTime } from '../../utils/time';
import { CheckButton } from '../CheckButton/CheckButton';
import { GoalProgress } from '../GoalProgress/GoalProgress';
import { StreakBadge } from '../StreakBadge/StreakBadge';
import styles from './HabitCard.module.css';

interface HabitCardProps {
  habit: TodayHabit;
  onCheck: (habitId: string) => Promise<void>;
  onArchive: (habit: TodayHabit) => void;
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

export function HabitCard({ habit, onCheck, onArchive }: HabitCardProps) {
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
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{habit.name}</h3>
          <button
            type="button"
            className={styles.archive}
            onClick={() => onArchive(habit)}
            aria-label={`Archivar «${habit.name}»`}
            title="Archivar hábito"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect width="20" height="5" x="2" y="3" rx="1" />
              <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
              <path d="M10 12h4" />
            </svg>
          </button>
        </div>

        <p className={statusClasses}>{getStatusText(habit)}</p>

        {habit.goalDays !== null && (
          <GoalProgress current={habit.currentStreak} goal={habit.goalDays} />
        )}
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