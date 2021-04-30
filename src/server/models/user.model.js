const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const APIError = require('../helpers/APIError');

const { Schema } = mongoose;

// GUIDE: All database models should be defined as separate files in this /models folder

// Database model for users

/**
 * User Schema
 */
const UserSchema = new Schema({
  // the actual database field name is _id, but you can access it with id
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  authTokenIds: {
    type: Array,
    default: []
  },
  emailVerification: {
    type: String,
    default: 'sample-code'
  },
  lastVerifiedEmail: {
    type: String,
    default: null
  },
  lastEmailSentAt: {
    type: Date,
    default: null
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
  filterSafe() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      createdAt: this.createdAt,
      emailVerified: this.isEmailVerified()
    };
  },
  isAuthTokenIdValid(authTokenId) {
    return this.authTokenIds.includes(authTokenId);
  },
  async invalidateAuthTokenId(authTokenId) {
    this.authTokenIds.pull(authTokenId);
    await this.save();
  },
  async addAuthTokenId(authTokenId) {
    this.authTokenIds.push(authTokenId);
    await this.save();
  },
  isEmailVerified() {
    return this.lastVerifiedEmail === this.email;
  },
  async newEmailVerification() {
    this.emailVerification = crypto.randomBytes(32).toString('hex');
    await this.save();
  },
  comparePassword(password) {
    return bcrypt.compare(password, this.password);
  },
  async setPassword(password) {
    this.password = await bcrypt.hash(password, 10);
    await this.save();
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(() => {
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  getCached(id) {
    return this.findById(id)
      .cache(0, `UserById-${id}`)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(() => {
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Find a user by email
   * @param {String} email - The email of user
   * @returns {Promise<User, APIError>}
   */
  getByEmail(email) {
    return this.findOne({ email })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(() => {
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema, 'Users');
