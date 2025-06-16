import { Router } from 'express';
const router = Router();
import validate from '@/middlewares/validate';

import { findTree } from './study.controller';
// import { updateSchema } from '@shared/types/study/study.schema';

router.get('/', findTree); // 전체
// router.get('/:id'); // 상세 정보
// router.post('/'); // 노드 추가
// router.put('/:id'); // 노드 수정
// router.delete('/:id'); // 삭제

// router.patch('/reorder'); // 같은 부모 내부 정렬
// router.patch('/:id/move'); // 부모 노드 변경

export default router;
