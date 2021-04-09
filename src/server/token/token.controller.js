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

/**
 * Get all tokens of a given user id
 */
function getUserTokens(req, res, next) {
  // not done
  const userId = req.user.id;
  const createdList = Token.find({ createdBy: userId });
  const receivedList = Token.find({ createdBy: userId });
  return { created, received };
}

/**
 * Sets isValid of a token to false
 */
function setTokenFalse(req, res, next) {
  const { token } = req;
  token.isValid = false;
  token.save();
  return res.json({});
}

module.exports = {
  loadToken,
  loadUser,
  getUserTokens,
  setTokenFalse
};
