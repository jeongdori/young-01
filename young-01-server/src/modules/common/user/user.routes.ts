import { Router } from 'express';
const router = Router();
import validate from '@middlewares/validate';

import {
    findMe,
    updateMe,
    deleteMe,
    findAll,
    findById,
    update,
    deleteById,
} from './user.controller';
import { updateSchema } from '@shared/types/user/user.schema';

router.get('/me', findMe);
router.put('/me', validate(updateSchema), updateMe);
router.patch('/me', deleteMe); // 삭제

router.get('/', findAll); // 목록 조회
router.get('/:id', findById); // 상세 조회
// router.post('/', validate(userSchema), userController.create); // 신규 등록
router.put('/:id', validate(updateSchema), update); // 수정
router.patch('/:id', deleteById); // 삭제

export default router;
