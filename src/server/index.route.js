const express = require('express');
const os = require('os');
const userRoutes = require('./user/user.route');
const authRoutes = require('./auth/auth.route');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// TODO: remove this. This is only for the front-end boilerplate
router.get('/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

module.exports = router;
