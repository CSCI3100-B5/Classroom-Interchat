const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./user.validation');
const userCtrl = require('./user.controller');
const { requireAccessToken, requireAdminAccess } = require('./../helpers/requireAuth');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(requireAdminAccess, userCtrl.list)

  /** POST /api/users - Create new user
   * NOTE: this is NOT the sign-up route, which is more restrictive
  */
  .post(requireAdminAccess, validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user
   * Should respond differently according to invoker's type
  */
  .get(requireAccessToken, userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(requireAdminAccess, validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(requireAdminAccess, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
