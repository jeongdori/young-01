import 'module-alias/register';
import '@/lib/loadEnv';
import '@/lib/redis';
// import '@models';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from '@/routes/index';
import authMiddleware from '@/middlewares/authMiddleware';

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true, // 쿠키, 세션 허용
    }),
);
app.use(cookieParser());
app.use(express.json());

app.use(authMiddleware);
app.use('/', userRoutes);

export default app;
