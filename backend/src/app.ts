import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { authRouter } from './modules/auth/auth.routes';
import { healthRouter } from './routes/health.routes';
import { habitsRouter } from './modules/habits/habits.routes';

export const app = express();

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/habits', habitsRouter);

app.use(errorHandler);