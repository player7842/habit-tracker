import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { createHabit, createUserAndLogin, resetDatabase } from './helpers';

beforeEach(resetDatabase);

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('POST /api/habits', () => {
  it('guarda la meta en días cuando es válida', async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post('/api/habits')
      .set(auth(token))
      .send({ name: 'Leer', goalDays: 7 });

    expect(res.status).toBe(201);
    expect(res.body.habit.goalDays).toBe(7);
  });

  it('rechaza una meta de menos de 2 días', async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post('/api/habits')
      .set(auth(token))
      .send({ name: 'Leer', goalDays: 1 });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/habits/:habitId', () => {
  it('archiva el hábito y deja de aparecer en el resumen de hoy', async () => {
    const token = await createUserAndLogin();
    const habitId = await createHabit(token, { name: 'Leer' });

    const res = await request(app)
      .delete(`/api/habits/${habitId}`)
      .set(auth(token));
    expect(res.status).toBe(204);

    const today = await request(app).get('/api/habits/today').set(auth(token));
    expect(today.body.habits).toHaveLength(0);
  });

  it('no deja archivar el hábito de otra persona', async () => {
    const ownerToken = await createUserAndLogin('ana@correo.com');
    const otherToken = await createUserAndLogin('beto@correo.com');
    const habitId = await createHabit(ownerToken, { name: 'Leer' });

    const res = await request(app)
      .delete(`/api/habits/${habitId}`)
      .set(auth(otherToken));
    expect(res.status).toBe(404);

    const today = await request(app)
      .get('/api/habits/today')
      .set(auth(ownerToken));
    expect(today.body.habits).toHaveLength(1);
  });
});