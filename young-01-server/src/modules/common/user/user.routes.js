const express = require('express');
const router = express.Router();
const validate = require('@middlewares/validate');

const userController = require('./user.controller');
const { userSchema } = require('./user.schema');

router.get('/me', userController.findMe);
router.put('/me', validate(userSchema), userController.updateMe);

router.get('/', userController.findAll); // 목록 조회
router.get('/:id', userController.findById); // 상세 조회
router.post('/', userController.create); // 신규 등록
router.put(
    '/:id',

    validate(userSchema),
    userController.update,
); // 수정
router.delete('/:id', userController.delete); // 삭제

module.exports = router;
