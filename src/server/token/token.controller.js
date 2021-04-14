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

/**
 * Get all tokens of a given user id
 */
async function getUserTokens(req, res, next) {
  const { user } = req;

  if (req.invoker.id !== user.id && !req.invoker.isAdmin) {
    return next(new APIError("Cannot view other's tokens", httpStatus.FORBIDDEN, true));
  }

  const createList = await Token.find({ createdBy: user.id })
    .populate('createdBy')
    .populate('receivedBy')
    .populate('classroom')
    .exec();
  const created = createList.map(x => x.filterSafe());

  const receivedList = await Token.find({ receivedBy: user.id })
    .populate('createdBy')
    .populate('receivedBy')
    .populate('classroom')
    .exec();
  const received = receivedList.map(x => x.filterSafe());

  return res.json({ created, received });
}

/**
 * Sets isValid of a token to false
 */
async function setTokenFalse(req, res, next) {
  let { token } = req;
  if (!token.isValid) return next(new APIError('The token is already invalid', httpStatus.BAD_REQUEST, true));
  token = await token
    .populate('createdBy')
    .populate('receivedBy')
    .populate('classroom').execPopulate();
  token.isValid = false;
  await token.save();
  return res.json(token.filterSafe());
}

module.exports = {
  loadToken,
  loadUser,
  getUserTokens,
  setTokenFalse
};
