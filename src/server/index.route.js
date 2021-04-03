const express = require('express');
const userRoutes = require('./user/user.route');
const authRoutes = require('./auth/auth.route');

const router = express.Router();

// TODO: GUIDE: remember to mount your xxx.route.js here

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /user
router.use('/user', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
