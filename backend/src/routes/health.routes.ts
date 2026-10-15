import { Router } from 'express';
import { pool } from '../db/pool';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const result = await pool.query('SELECT now() AS server_time');
  res.json({
    status: 'ok',
    database: 'connected',
    serverTime: result.rows[0].server_time,
  });
});