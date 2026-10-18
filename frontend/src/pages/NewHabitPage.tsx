import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { ApiError } from '../api/client';
import type { HabitTemplate } from '../api/habits';
import { Button } from '../components/Button/Button';
import { Chip } from '../components/Chip/Chip';
import { Field } from '../components/Field/Field';
import {
  useCreateHabitMutation,
  useTemplatesQuery,
} from '../features/habits/useHabits';
import styles from './NewHabitPage.module.css';

const GOAL_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Sin meta', value: null },
  { label: '7 días', value: 7 },
  { label: '21 días', value: 21 },
  { label: '30 días', value: 30 },
];

function groupByCategory(templates: HabitTemplate[]) {
  return templates.reduce<Record<string, HabitTemplate[]>>(
    (groups, template) => {
      (groups[template.category] ??= []).push(template);
      return groups;
    },
    {},
  );
}

export function NewHabitPage() {
  const navigate = useNavigate();
  const templatesQuery = useTemplatesQuery();
  const createHabit = useCreateHabitMutation();

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState('10:00');
  const [goalDays, setGoalDays] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groups = groupByCategory(templatesQuery.data?.templates ?? []);
  const canSubmit =
    templateId !== null || (isCustom && customName.trim().length >= 2);

  function chooseTemplate(id: string) {
    setTemplateId(id);
    setIsCustom(false);
  }

  function chooseCustom() {
    setTemplateId(null);
    setIsCustom(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setError(null);

    try {
      await createHabit.mutateAsync({
        templateId: templateId ?? undefined,
        name: isCustom ? customName.trim() : undefined,
        deadlineTime: hasDeadline ? deadline : undefined,
        goalDays: goalDays ?? undefined,
      });
      navigate('/');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo crear el hábito. Intenta de nuevo.',
      );
    }
  }

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Volver
      </Link>
      <h1 className={styles.title}>Nuevo hábito</h1>
      <p className={styles.subtitle}>Elige uno del catálogo o crea el tuyo.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. ¿Qué quieres lograr?</h2>

          {templatesQuery.isPending && (
            <p className={styles.muted}>Cargando catálogo…</p>
          )}
          {templatesQuery.isError && (
            <p className={styles.muted}>
              No pudimos cargar el catálogo, pero puedes crear uno propio.
            </p>
          )}

          {Object.entries(groups).map(([category, templates]) => (
            <div key={category} className={styles.group}>
              <h3 className={styles.category}>{category}</h3>
              <div className={styles.options}>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className={`${styles.option} ${
                      templateId === template.id ? styles.optionSelected : ''
                    }`}
                    aria-pressed={templateId === template.id}
                    onClick={() => chooseTemplate(template.id)}
                  >
                    <span className={styles.optionName}>{template.name}</span>
                    {template.description && (
                      <span className={styles.optionDescription}>
                        {template.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.group}>
            <h3 className={styles.category}>Personalizado</h3>
            <button
              type="button"
              className={`${styles.option} ${
                isCustom ? styles.optionSelected : ''
              }`}
              aria-pressed={isCustom}
              onClick={chooseCustom}
            >
              <span className={styles.optionName}>Crear uno propio</span>
              <span className={styles.optionDescription}>
                Ponle el nombre que quieras.
              </span>
            </button>

            {isCustom && (
              <Field
                label="Nombre del hábito"
                placeholder="Ej: Caminar 20 minutos"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                minLength={2}
                maxLength={80}
              />
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. Hora límite <span className={styles.optional}>(opcional)</span>
          </h2>

          <label className={styles.check}>
            <input
              type="checkbox"
              checked={hasDeadline}
              onChange={(e) => setHasDeadline(e.target.checked)}
            />
            <span>Después de esta hora ya no podré marcarlo</span>
          </label>

          {hasDeadline && (
            <Field
              label="Hasta qué hora"
              type="time"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            3. Meta <span className={styles.optional}>(opcional)</span>
          </h2>
          <p className={styles.muted}>
            Días seguidos que quieres lograr. Si fallas un día, la barra vuelve
            a empezar.
          </p>
          <div className={styles.chips}>
            {GOAL_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={goalDays === option.value}
                onClick={() => setGoalDays(option.value)}
              />
            ))}
          </div>
        </section>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={!canSubmit || createHabit.isPending}
        >
          {createHabit.isPending ? 'Creando…' : 'Crear hábito'}
        </Button>
      </form>
    </main>
  );
}