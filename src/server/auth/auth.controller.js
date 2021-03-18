const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const crypto = require('crypto');
const APIError = require('../helpers/APIError');
const config = require('../config/config');

// sample user, used for authentication
const sampleUser = {
  username: 'react',
  password: 'express'
};

// sample array of refresh tokens ids
// TODO: store this in user's document in database
let sampleRefreshTokenIds = [];

function generateAccessToken(user) {
  return jwt.sign(user, config.accessTokenSecret, { expiresIn: '10m' });
}

/**
 * Returns jwt access and refresh token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // TODO: fetch the user auth details from database
  if (req.body.username === sampleUser.username && req.body.password === sampleUser.password) {
    const refreshId = crypto.randomBytes(16).toString('hex');
    const user = { username: sampleUser.username, tokenId: refreshId };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, config.refreshTokenSecret);
    sampleRefreshTokenIds.push(refreshId);
    return res.json({
      accessToken,
      refreshToken,
      username: sampleUser.username
    });
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

/**
 * Returns a new access token if authorized with refresh token
 * @param req
 * @param res
 * @returns {*}
 */
function token(req, res, next) {
  // req.user is assigned by jwt middleware if valid token is provided
  if (!sampleRefreshTokenIds.includes(req.user.tokenId)) {
    next(new APIError('This refresh token has expired', httpStatus.UNAUTHORIZED, true));
  }
  const user = { username: req.user.username, tokenId: req.user.tokenId };
  const accessToken = generateAccessToken(user);
  return res.json({
    accessToken,
    username: sampleUser.username
  });
}

/**
 * Will remove refresh token only if it is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function logout(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  sampleRefreshTokenIds = sampleRefreshTokenIds.filter(x => x !== req.user.tokenId);
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
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = {
  login, token, logout, getRandomNumber
};
