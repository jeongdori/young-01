import { Router } from 'express';
const router = Router();

/**
 *
 * common
 *
 */
// auth
import authRoutes from '@/modules/common/auth/auth.routes';
// user
import userRoutes from '@/modules/common/user/user.routes';

/**
 *
 * home
 *
 */
// study
import studyRoutes from '@/modules/home/study/study.routes';

router.use('/', authRoutes);
router.use('/user', userRoutes);
router.use('/study', studyRoutes);

export default router;
