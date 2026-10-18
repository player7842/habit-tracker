import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from '../api/client';
import { Button } from '../components/Button/Button';
import { HabitCard } from '../components/HabitCard/HabitCard';
import { useAuth } from '../features/auth/useAuth';
import { useCheckInMutation, useTodayQuery } from '../features/habits/useHabits';
import { formatLongDate } from '../utils/time';
import styles from './HabitsPage.module.css';

export function HabitsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data, isPending, isError, error, refetch } = useTodayQuery();
  const checkIn = useCheckInMutation();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      signOut();
    }
  }, [error, signOut]);

  async function handleCheck(habitId: string) {
    try {
      await checkIn.mutateAsync(habitId);
      setNotice(null);
    } catch (err) {
      setNotice(
        err instanceof ApiError
          ? err.message
          : 'No se pudo registrar el hábito. Intenta de nuevo.',
      );
      throw err;
    }
  }

  const habits = data?.habits ?? [];
  const doneCount = habits.filter((habit) => habit.doneToday).length;
  const allDone = habits.length > 0 && doneCount === habits.length;
  const percent = habits.length > 0 ? (doneCount / habits.length) * 100 : 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.date}>{data ? formatLongDate(data.today) : ''}</p>
          <h1 className={styles.greeting}>Hola, {user?.displayName}</h1>
        </div>
        <button type="button" className={styles.logout} onClick={signOut}>
          Salir
        </button>
      </header>

      {habits.length > 0 && (
        <section className={styles.progress} aria-label="Progreso de hoy">
          <p className={styles.progressText}>
            <span>{allDone ? '¡Día perfecto!' : 'Tu día'}</span>
            <span>
              {doneCount} de {habits.length}
            </span>
          </p>
          <div
            className={styles.bar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={habits.length}
            aria-valuenow={doneCount}
          >
            <div className={styles.barFill} style={{ width: `${percent}%` }} />
          </div>
        </section>
      )}

      {notice && (
        <p className={styles.notice} role="alert">
          {notice}
        </p>
      )}

      {isPending && <p className={styles.message}>Cargando tus hábitos…</p>}

      {isError && !data && (
        <div className={styles.message}>
          <p className={styles.messageTitle}>No pudimos cargar tus hábitos</p>
          <p>{error?.message}</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      )}

      {data && habits.length === 0 && (
        <div className={styles.message}>
          <p className={styles.messageTitle}>Aún no tienes hábitos</p>
          <p>Elige uno del catálogo y empieza tu primera racha.</p>
          <Button onClick={() => navigate('/habits/new')}>
            Agregar mi primer hábito
          </Button>
        </div>
      )}

      {habits.length > 0 && (
        <div className={styles.list}>
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onCheck={handleCheck} />
          ))}
        </div>
      )}

      {habits.length > 0 && (
        <div className={styles.add}>
          <Button fullWidth onClick={() => navigate('/habits/new')}>
            Nuevo hábito
          </Button>
        </div>
      )}
    </main>
  );
}