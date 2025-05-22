const express = require('express');
const router = express.Router();

/**
 *
 * auth
 *
 */

const authRoutes = require('@/modules/common/auth/auth.routes');

/**
 *
 * member
 *
 */

// user
const userRoutes = require('@/modules/common/user/user.routes');

router.use('/', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
