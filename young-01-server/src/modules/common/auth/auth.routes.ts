import { Router } from 'express';
const router = Router();
import validate from '@middlewares/validate';

import { loginSchema, registerSchema } from '@shared/types/user/user.schema';

import { getPublicKey, login, logout, register, refresh } from './auth.controller';
router.get('/public-key', getPublicKey);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

router.post('/register', validate(registerSchema), register);
router.post('/refresh', refresh);

export default router;
