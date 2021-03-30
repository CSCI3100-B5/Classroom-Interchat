const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./auth.validation');
const authCtrl = require('./auth.controller');
const { requireRefreshToken } = require('./../helpers/requireAuth');

const router = express.Router();

/** POST /api/auth/login - Returns tokens if correct email and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/signup - Create an account and return the user */
router.route('/signup')
  .post(validate(paramValidation.signup), authCtrl.signup);

/** GET /api/auth/token - Returns a new access token if the refresh token is valid */
router.route('/token')
  .get(requireRefreshToken, authCtrl.token);

/** DELETE /api/auth/logout - needs refresh token in header.
 * Authorization: Bearer {token} */
router.route('/logout')
  .delete(requireRefreshToken, authCtrl.logout);

module.exports = router;
