const express = require('express');
const { validate } = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('./auth.validation');
const authCtrl = require('./auth.controller');
const config = require('../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns tokens if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth/token - Returns a new access token if the refresh token is valid */
router.route('/token')
  .get(expressJwt({
    secret: config.refreshTokenSecret,
    algorithms: ['HS256']
  }), authCtrl.token);

/** DELETE /api/auth/logout - needs refresh token returned by the above as header.
 * Authorization: Bearer {token} */
router.route('/logout')
  .delete(expressJwt({
    secret: config.refreshTokenSecret,
    algorithms: ['HS256']
  }), authCtrl.logout);

/** GET /api/auth/random-number - Protected route,
 * needs access token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.accessTokenSecret, algorithms: ['HS256'] }), authCtrl.getRandomNumber);

module.exports = router;
