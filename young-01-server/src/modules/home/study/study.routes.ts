import { Router } from 'express';
const router = Router();
import validate from '@/middlewares/validate';

// import {} from './study.controller';
// import { updateSchema } from '@shared/types/study/study.schema';

router.get('/topics'); // 전체
router.get('/topics/:id'); // 상세 정보
router.post('/topics'); // 노드 추가
router.put('/topics/:id'); // 노드 수정
router.delete('/topics/:id'); // 삭제

router.patch('/topics/reorder'); // 같은 부모 내부 정렬
router.patch('/topics/:id/move'); // 부모 노드 변경

export default router;
