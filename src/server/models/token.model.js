const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { filterSafeOrOriginal } = require('./model-utils');

const { Schema } = mongoose;

/**
 * Token Schema
 */
const TokenSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom'
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  value: {
    type: String,
    default: ''
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
TokenSchema.method({
  filterSafe() {
    return {
      id: this.id,
      createdBy: filterSafeOrOriginal(this.createdBy),
      receivedBy: filterSafeOrOriginal(this.receivedBy),
      createdAt: this.createdAt,
      classroom: filterSafeOrOriginal(this.classroom),
      isValid: this.isValid,
      value: this.value
    };
  },
});

/**
 * Statics
 */
TokenSchema.statics = {
  /**
   * Get token
   * @param {ObjectId} id - The objectId of token.
   * @returns {Promise<Token, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((token) => {
        if (token) {
          return token;
        }
        const err = new APIError('No such token exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(() => {
        const err = new APIError('No such token exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List tokens in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of tokens to be skipped.
   * @param {number} limit - Limit number of tokens to be returned.
   * @returns {Promise<Token[]>}
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
 * @typedef Token
 */
module.exports = mongoose.model('Token', TokenSchema, 'Tokens');
