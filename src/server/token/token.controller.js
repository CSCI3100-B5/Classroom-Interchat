const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const APIError = require('./../helpers/APIError');

/**
 * Load token and append to req.
 */
function loadToken(req, res, next, id) {
  Token.get(id)
    .then((token) => {
      req.token = token;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Load user and append to req.
 */
function loadUser(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(e => next(e));
}

// TODO: invalidate token
// TODO: get all tokens of a user

module.exports = {
  loadToken, loadUser
};
