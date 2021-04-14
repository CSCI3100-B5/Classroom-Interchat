const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const crypto = require('crypto');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const User = require('../models/user.model');

const smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

function generateAccessToken(payload) {
  return jwt.sign(payload, config.accessTokenSecret, { expiresIn: '10s' }); // TODO: debug
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
 * Returns jwt access and refresh token if valid email and password is provided
 */
async function login(req, res, next) {
  let user;
  try {
    user = await User.getByEmail(req.body.email);
  } catch (e) {
    return next(new APIError('Email not found', httpStatus.UNAUTHORIZED, true));
  }
  if (!await user.comparePassword(req.body.password)) {
    const err = new APIError('Incorrect password', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }
  const refreshId = crypto.randomBytes(16).toString('hex');
  const payload = { userId: user.id, authTokenId: refreshId };
  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(payload, config.refreshTokenSecret);
  user.authTokenIds.push(refreshId);
  try {
    await user.save();
  } catch (e) {
    return next(e);
  }
  return res.json({
    accessToken,
    refreshToken,
    user: user.filterSafe()
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
    return res.json(user.filterSafe());
  } catch (e) {
    return next(e);
  }
}

async function sendEmail(req, res, next) {
  const user = req.invoker;
  if (user.email === user.lastVerifiedEmail) {
    return next(new APIError('Your email is already verified', httpStatus.BAD_REQUEST, true));
  }
  if (user.lastEmailSentAt) {
    if ((new Date()).getTime() - user.lastEmailSentAt.getTime() < 1000 * 60 * 5) { // 5 minutes
      return next(new APIError('Please wait for at least 5 minutes before requesting for another email', httpStatus.TOO_MANY_REQUESTS, true));
    }
  }
  if (!user.emailVerification) {
    // normally shouldn't be necessary, just a safeguard
    await user.newEmailVerification();
  }
  user.lastEmailSentAt = new Date();
  await user.save();
  cachegoose.clearCache(`UserById-${user.id}`);
  const link = `${config.baseUrl}api/auth/email/${user.id}/${user.emailVerification}`;
  const mailOptions = {
    to: user.email,
    subject: 'Confirm your email for your Classroom Interchat account',
    html: `Hello,<br><br>Please click on the link to verify your email.<br><a href=${link}>Click here to verify</a><br><br>If the above link does not work, copy this link to the browser:<br>${link}<br><br>Classroom Interchat`
  };
  console.log(mailOptions);
  try {
    await new Promise((resolve, reject) => smtpTransport.sendMail(
      mailOptions,
      (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      }
    ));
  } catch (ex) {
    return next(ex);
  }
  return res.sendStatus(httpStatus.NO_CONTENT);
}

async function verifyEmail(req, res, next) {
  const { user } = req;
  if (user.email === user.lastVerifiedEmail) {
    return res.redirect('../../../../account#manageProfile');
  }
  if (user.emailVerification === req.params.verification) {
    user.lastVerifiedEmail = user.email;
    await user.save();
    cachegoose.clearCache(`UserById-${user.id}`);
    return res.redirect('../../../../account#manageProfile');
  }
  return res.send('This email verification link is invalid');
}

/**
 * Returns a new access token if authorized with refresh token
 */
async function token(req, res, next) {
  // req.payload and req.invoker is assigned if valid token is provided
  const user = req.invoker;
  if (!user.isAuthTokenIdValid(req.payload.authTokenId)) {
    return next(new APIError('This refresh token has expired', httpStatus.FORBIDDEN, true));
  }
  const payload = { userId: user.id, authTokenId: req.payload.authTokenId };
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
    await req.invoker.invalidateAuthTokenId(req.payload.authTokenId);
  } catch (e) {
    return next(e);
  }
  return res.sendStatus(httpStatus.NO_CONTENT);
}

module.exports = {
  loadUser, login, signup, sendEmail, verifyEmail, token, logout
};
