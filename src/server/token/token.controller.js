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
async function getUserTokens(req, res, next) {
  const { user } = req.user;

  const created = [];
  const received = [];

  await Token
    .find({ createdBy: user.id })
    .exec()
    .than((Tokens) => {
      Tokens.forEach((token) => {
        const receiver = User.get(token.receivedBy);

        created.push({
          id: token.id,
          createdBy: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          receivedBy: {
            id: receiver.id,
            name: receiver.name,
            email: receiver.email
          },
          createdAt: token.createdAt,
          isValid: token.isValid
        });
      });
    });

  await Token
    .find({ receivedBy: user.id })
    .exec()
    .than((Tokens) => {
      Tokens.forEach((token) => {
        const creater = User.get(token.createdBy);

        created.push({
          id: token.id,
          createdBy: {
            id: creater.id,
            name: creater.name,
            email: creater.email
          },
          receivedBy: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          createdAt: token.createdAt,
          isValid: token.isValid
        });
      });
    });

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
