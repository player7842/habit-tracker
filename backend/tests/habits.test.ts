import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { createUserAndLogin, resetDatabase } from './helpers';

beforeEach(resetDatabase);

describe('POST /api/habits', () => {
  it('guarda la meta en días cuando es válida', async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Leer', goalDays: 7 });

    expect(res.status).toBe(201);
    expect(res.body.habit.goalDays).toBe(7);
  });

  it('rechaza una meta de menos de 2 días', async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Leer', goalDays: 1 });

    expect(res.status).toBe(400);
  });
});