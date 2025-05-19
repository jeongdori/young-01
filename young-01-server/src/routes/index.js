const express = require('express');
const router = express.Router();

/**
 *
 * auth
 *
 */

const authRoutes = require('@/modules/auth/auth.routes');

/**
 *
 * member
 *
 */

// user
const userRoutes = require('@/modules/member/user/user.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
