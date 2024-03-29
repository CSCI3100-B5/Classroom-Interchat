const { compose } = require('compose-middleware');
const expressJwt = require('express-jwt');
const httpStatus = require('http-status');
const config = require('../config/config');
const User = require('../models/user.model');
const APIError = require('./APIError');

// compose-middleware is used to group several middlewares
// into a convenient package

// validate the access token and load the user if the access token is valid
const requireAccessToken = compose([
  expressJwt({
    secret: config.accessTokenSecret,
    algorithms: ['HS256'],
    userProperty: 'payload'
  }),
  function loadInvoker(req, res, next) {
    User.get(req.payload.userId)
      .then((user) => {
        req.invoker = user; // eslint-disable-line no-param-reassign
        return next();
      })
      .catch(e => next(e));
  }
]);

// validate the access token and also require that the user has verified
// their email
const requireEmailVerified = compose([
  requireAccessToken,
  function checkEmail(req, res, next) {
    if (!req.invoker.isEmailVerified()) return next(new APIError('Email address not verified', httpStatus.FORBIDDEN, true));
    return next();
  }
]);

// validate the refresh token and load the user if the refresh token is valid
const requireRefreshToken = compose([
  expressJwt({
    secret: config.refreshTokenSecret,
    algorithms: ['HS256'],
    userProperty: 'payload'
  }),
  function loadInvoker(req, res, next) {
    User.get(req.payload.userId)
      .then((user) => {
        req.invoker = user; // eslint-disable-line no-param-reassign
        return next();
      })
      .catch(e => next(e));
  }
]);

// validate the access token and also require that the user is an admin
const requireAdminAccess = compose([
  requireAccessToken,
  function checkAdmin(req, res, next) {
    if (!req.invoker.isAdmin) {
      return next(new APIError('You do not have sufficient permission', httpStatus.FORBIDDEN, true));
    }
    return next();
  }
]);

module.exports = {
  requireAccessToken, requireEmailVerified, requireRefreshToken, requireAdminAccess
};
