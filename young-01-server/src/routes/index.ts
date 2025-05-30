import { Router } from 'express';
const router = Router();

/**
 *
 * auth
 *
 */

import authRoutes from '@/modules/common/auth/auth.routes';

/**
 *
 * member
 *
 */

// user
import userRoutes from '@/modules/common/user/user.routes';

router.use('/', authRoutes);
router.use('/user', userRoutes);

export default router;
