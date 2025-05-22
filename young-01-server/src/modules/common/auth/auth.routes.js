const express = require('express');
const router = express.Router();
const validate = require('@middlewares/validate');

const {
    loginSchema,
    registerSchema,
} = require('@modules/common/user/user.schema');

const authController = require('./auth.controller');

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

router.post('/register', validate(registerSchema), authController.register);
router.post('/refresh', authController.refresh);

module.exports = router;
