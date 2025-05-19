const express = require('express');
const router = express.Router();
const authMiddleware = require('@middlewares/authMiddleware');
const validate = require('@middlewares/validate');

const userController = require('./user.controller');
const { userSchema } = require('./user.schema');

router.get('/me', authMiddleware, userController.findMe);
router.put(
    '/me',
    authMiddleware,
    validate({ body: userSchema }),
    userController.updateMe,
);

router.get('/', userController.findAll); // 목록 조회
router.get('/:id', authMiddleware, userController.findById); // 상세 조회
router.post('/', authMiddleware, userController.create); // 신규 등록
router.put(
    '/:id',
    authMiddleware,
    validate({ body: userSchema }),
    userController.update,
); // 수정
router.delete('/:id', authMiddleware, userController.delete); // 삭제

module.exports = router;
