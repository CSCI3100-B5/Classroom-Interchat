const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const User = require('../models/user.model');
const APIError = require('./../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res, next) {
  if (req.invoker.id !== req.user.id && !req.invoker.isAdmin) {
    return next(new APIError("Cannot access others' profiles", httpStatus.FORBIDDEN, true));
  }
  return res.json(req.user.filterSafe());
}

/**
 * Admin-only router: create a new user with less restrictions
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @property {boolean} req.body.isAdmin - Whether the user is an admin
 * @property {string} req.body.emailVerification - The email verification code of user.
 * @property {string} req.body.lastVerifiedEmail - The latest email that has been verified
 *  If this is equal to email, the user has already completed email verification.
 * @returns {User}
 */
async function create(req, res, next) {
  try {
    if (await User.exists({ email: req.body.email })) {
      return next(new APIError('This email is already used', httpStatus.BAD_REQUEST, true));
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      emailVerification: req.body.emailVerification,
      lastVerifiedEmail: req.body.lastVerifiedEmail
    });
    await user.setPassword(req.body.password);
    cachegoose.clearCache(`UserById-${user.id}`);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

/**
 * Update existing user
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
async function update(req, res, next) {
  try {
    if (req.invoker.id !== req.user.id && !req.invoker.isAdmin) {
      return next(new APIError("Cannot update others' profiles", httpStatus.FORBIDDEN, true));
    }
    const { user } = req;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) await user.setPassword(req.body.password);
    else await user.save();
    cachegoose.clearCache(`UserById-${user.id}`);
    return res.json(user.filterSafe());
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  load, get, create, update
};
