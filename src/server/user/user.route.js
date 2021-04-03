const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./user.validation');
const userCtrl = require('./user.controller');
const { requireAccessToken, requireAdminAccess } = require('./../helpers/requireAuth');

// TODO: GUIDE: you may copy this file to make your xxx.route.js

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/user - Create a new user (admin only)
   * NOTE: this is NOT the sign-up route, which is more restrictive
  */
  .post(requireAdminAccess, validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/user/:userId - Get user
   * Should respond differently according to whether invoker is admin
  */
  .get(requireAccessToken, userCtrl.get)

  /** PATCH /api/user/:userId - Update user */
  .patch(requireAccessToken, validate(paramValidation.updateUser), userCtrl.update);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
