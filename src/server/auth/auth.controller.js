const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const crypto = require('crypto');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const User = require('../models/user.model');

function generateAccessToken(payload) {
  return jwt.sign(payload, config.accessTokenSecret, { expiresIn: '10m' });
}

/**
 * Returns jwt access and refresh token if valid email and password is provided
 */
async function login(req, res, next) {
  let user;
  try {
    user = await User.getByEmail(req.body.email);
  } catch (e) {
    // TODO: return a more helpful error message
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
    userId: user.id
  });
}

/**
 * Sign up for user
 */
async function signup(req, res, next) {
  try {
    if (await User.exists({ email: req.body.email })) {
      return next(new APIError('This email is already used', httpStatus.BAD_REQUEST, true));
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      isAdmin: false,
      lastVerifiedEmail: null
    });
    await user.setPassword(req.body.password);
    await user.newEmailVerification();
    return res.json({
      name: user.name,
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin
    });
  } catch (e) {
    return next(e);
  }
}

// function verifyEmail(req, res, next) {
// send an email to the user
// }

/**
 * Returns a new access token if authorized with refresh token
 */
async function token(req, res, next) {
  // req.payload and req.invoker is assigned if valid token is provided
  const user = req.invoker;
  if (!user.isTokenIdValid(req.payload.tokenId)) {
    return next(new APIError('This refresh token has expired', httpStatus.FORBIDDEN, true));
  }
  const payload = { userId: user.id, tokenId: req.payload.tokenId };
  const accessToken = generateAccessToken(payload);
  return res.json({
    accessToken,
    userId: user.id
  });
}

/**
 * Will remove refresh token only if it is provided in header.
 */
async function logout(req, res, next) {
  // req.payload and req.invoker is assigned if valid token is provided
  try {
    await req.invoker.invalidateTokenId(req.payload.tokenId);
  } catch (e) {
    return next(e);
  }
  return res.sendStatus(httpStatus.NO_CONTENT);
}

module.exports = {
  login, signup, token, logout
};
