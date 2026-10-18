import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';
import { createHabit, createUserAndLogin, resetDatabase } from './helpers';

beforeEach(resetDatabase);

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('check-ins', () => {
  it('marca el hábito como cumplido hoy', async () => {
    const token = await createUserAndLogin();
    const habitId = await createHabit(token, { name: 'Meditar' });

    const res = await request(app)
      .post(`/api/habits/${habitId}/check-ins`)
      .set(auth(token));

    expect(res.status).toBe(201);
    expect(res.body.checkIn.status).toBe('done');
  });

  it('no permite marcar dos veces el mismo día', async () => {
    const token = await createUserAndLogin();
    const habitId = await createHabit(token, { name: 'Meditar' });

    await request(app).post(`/api/habits/${habitId}/check-ins`).set(auth(token));
    const res = await request(app)
      .post(`/api/habits/${habitId}/check-ins`)
      .set(auth(token));

    expect(res.status).toBe(409);
  });

  it('rechaza el check-in si ya pasó la hora límite', async () => {
    const token = await createUserAndLogin();
    const habitId = await createHabit(token, {
      name: 'Madrugar',
      deadlineTime: '00:00',
    });

    const res = await request(app)
      .post(`/api/habits/${habitId}/check-ins`)
      .set(auth(token));

    expect(res.status).toBe(403);
  });

  it('no deja marcar el hábito de otra persona', async () => {
    const ownerToken = await createUserAndLogin('ana@correo.com');
    const otherToken = await createUserAndLogin('beto@correo.com');
    const habitId = await createHabit(ownerToken, { name: 'Leer' });

    const res = await request(app)
      .post(`/api/habits/${habitId}/check-ins`)
      .set(auth(otherToken));

    expect(res.status).toBe(404);
  });

  it('calcula la racha contando desde ayer si hoy aún no se marcó', async () => {
    const token = await createUserAndLogin();
    const habitId = await createHabit(token, { name: 'Leer' });

    const first = await request(app)
      .get(`/api/habits/${habitId}/check-ins`)
      .set(auth(token));
    const today: string = first.body.today;

    await pool.query(
      `INSERT INTO check_ins (habit_id, check_date, status)
       VALUES ($1, $2::date - 1, 'done'), ($1, $2::date - 2, 'done')`,
      [habitId, today],
    );

    const beforeToday = await request(app)
      .get(`/api/habits/${habitId}/check-ins`)
      .set(auth(token));
    expect(beforeToday.body.currentStreak).toBe(2);

    await request(app).post(`/api/habits/${habitId}/check-ins`).set(auth(token));

    const afterToday = await request(app)
      .get(`/api/habits/${habitId}/check-ins`)
      .set(auth(token));
    expect(afterToday.body.currentStreak).toBe(3);
  });
  
  it('devuelve el resumen de hoy con estado y racha de cada hábito', async () => {
    const token = await createUserAndLogin();
    const readingId = await createHabit(token, { name: 'Leer', goalDays: 7 });
    await createHabit(token, { name: 'Madrugar', deadlineTime: '00:00' });

    await request(app)
      .post(`/api/habits/${readingId}/check-ins`)
      .set(auth(token));

    const res = await request(app).get('/api/habits/today').set(auth(token));

    expect(res.status).toBe(200);
    expect(res.body.habits).toHaveLength(2);

    const reading = res.body.habits.find(
      (habit: { name: string }) => habit.name === 'Leer',
    );
    const early = res.body.habits.find(
      (habit: { name: string }) => habit.name === 'Madrugar',
    );

    expect(reading).toMatchObject({
      doneToday: true,
      canCheckIn: false,
      currentStreak: 1,
      goalDays: 7,
    });
    expect(early).toMatchObject({
      doneToday: false,
      canCheckIn: false,
      currentStreak: 0,
      goalDays: null,
    });
  });
});