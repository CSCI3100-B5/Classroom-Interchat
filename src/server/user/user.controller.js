const httpStatus = require('http-status');
const User = require('./user.model');
const APIError = require('./../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.userType - The type of user.
 * @property {string} req.body.emailVerification - The email verification code of user.
 *  If this is null, the user has already completed email verification.
 * @returns {User}
 */
async function create(req, res, next) {
  try {
    if (await User.exists({ username: req.body.username })) {
      return next(new APIError('Username is occupied', httpStatus.BAD_REQUEST, true));
    }
    if (await User.exists({ email: req.body.email })) {
      return next(new APIError('This email is already used', httpStatus.BAD_REQUEST, true));
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      userType: req.body.userType,
      emailVerification: req.body.emailVerification
    });
    await user.setPassword(req.body.password);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.userType - The type of user.
 * @returns {User}
 */
async function update(req, res, next) {
  try {
    const { user } = req;
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.userType) user.userType = req.body.userType;
    if (req.body.emailVerification !== undefined) {
      user.emailVerification = req.body.emailVerification;
    }
    if (req.body.password) await user.setPassword(req.body.password);
    else await user.save();
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const { user } = req;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = {
  load, get, create, update, list, remove
};
