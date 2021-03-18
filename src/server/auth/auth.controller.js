const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const crypto = require('crypto');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const User = require('../user/user.model');

// sample user, used for authentication
const sampleUser = {
  username: 'react',
  password: 'express'
};

function generateAccessToken(payload) {
  return jwt.sign(payload, config.accessTokenSecret, { expiresIn: '10m' });
}

/**
 * Returns jwt access and refresh token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  // TODO: fetch the user auth details from database
  let user;
  try {
    user = await User.getByUsername(req.body.username);
  } catch (e) {
    return next(e);
  }
  if (!await user.comparePassword(req.body.password)) {
    const err = new APIError('Incorrect password', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }
  const refreshId = crypto.randomBytes(16).toString('hex');
  const payload = { userId: user.id, tokenId: refreshId };
  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(payload, config.refreshTokenSecret);
  user.tokenIds.push(refreshId);
  try {
    await user.save();
  } catch (e) {
    return next(e);
  }
  return res.json({
    accessToken,
    refreshToken,
    userId: user.id,
    username: user.username
  });
}

/**
 * Returns a new access token if authorized with refresh token
 * @param req
 * @param res
 * @returns {*}
 */
async function token(req, res, next) {
  // req.payload is assigned by jwt middleware if valid token is provided
  let user;
  try {
    user = await User.get(req.payload.userId);
  } catch (e) {
    return next(e);
  }
  if (!user.isTokenIdValid(req.payload.tokenId)) {
    return next(new APIError('This refresh token has expired', httpStatus.UNAUTHORIZED, true));
  }
  const payload = { userId: user.id, tokenId: req.payload.tokenId };
  const accessToken = generateAccessToken(payload);
  return res.json({
    accessToken,
    userId: user.id,
    username: sampleUser.username
  });
}

/**
 * Will remove refresh token only if it is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
async function logout(req, res, next) {
  // req.payload is assigned by jwt middleware if valid token is provided
  let user;
  try {
    user = await User.get(req.payload.userId);
    await user.invalidateTokenId(req.payload.tokenId);
  } catch (e) {
    return next(e);
  }
  return res.sendStatus(httpStatus.NO_CONTENT);
}

/**
 * This is a sample protected route.
 * Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.payload is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.payload,
    num: Math.random() * 100
  });
}

module.exports = {
  login, token, logout, getRandomNumber
};
