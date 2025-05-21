const express = require('express');
const router = express.Router();
const validate = require('@middlewares/validate');

const authController = require('./auth.controller');
const { loginSchema, registerSchema } = require('./auth.schema');

router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/logout', authController.logout);

router.post(
    '/register',
    validate({ body: registerSchema }),
    authController.register,
);
router.post('/refresh', authController.refresh);

module.exports = router;
