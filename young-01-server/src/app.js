require('module-alias/register');
require('@lib/loadEnv');
require('@lib/redis');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const userRoutes = require('@routes/index');

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true, // 쿠키, 세션 허용
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use('/', userRoutes);

module.exports = app;
