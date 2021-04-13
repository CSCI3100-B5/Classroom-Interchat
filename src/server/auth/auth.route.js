const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./auth.validation');
const authCtrl = require('./auth.controller');
const { requireRefreshToken, requireAccessToken } = require('./../helpers/requireAuth');

const router = express.Router();

/** POST /api/auth/login - Returns tokens if correct email and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/signup - Create an account and return the user */
router.route('/signup')
  .post(validate(paramValidation.signup), authCtrl.signup);

/** POST /api/auth/email - Send a verification email to the user */
router.route('/email')
  .post(requireAccessToken, authCtrl.sendEmail);

/** GET /api/auth/email/:userId/:verification - A link that the user click from the email,
 * verifies the account email
 */
router.route('/email/:userId/:verification')
  .get(authCtrl.verifyEmail);

/** GET /api/auth/token - Returns a new access token if the refresh token is valid */
router.route('/token')
  .get(requireRefreshToken, authCtrl.token);

/** DELETE /api/auth/logout - needs refresh token in header.
 * Authorization: Bearer {token} */
router.route('/logout')
  .delete(requireRefreshToken, authCtrl.logout);

router.param('userId', authCtrl.loadUser);

module.exports = router;
