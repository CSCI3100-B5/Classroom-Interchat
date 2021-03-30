const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tokenIds: {
    type: Array,
    default: []
  },
  userType: {
    type: String,
    enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    default: 'STUDENT',
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  emailVerification: {
    type: String,
    default: 'non-empty'
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
  isTokenIdValid(tokenId) {
    return this.tokenIds.includes(tokenId);
  },
  async invalidateTokenId(tokenId) {
    this.tokenIds.pull(tokenId);
    await this.save();
  },
  async addTokenId(tokenId) {
    this.tokenIds.push(tokenId);
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
      });
  },

  getByEmail(email) {
    return this.findOne({ email })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
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
