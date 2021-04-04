const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { Schema } = mongoose;

/**
 * Classroom Schema
 */
const ClassroomSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['instructur', 'student', 'requesting']
    },
    isMuted: {
      type: Boolean,
      default: false
    }
  }],
  isMuted: {
    type: Boolean,
    default: false
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
ClassroomSchema.method({
});

/**
 * Statics
 */
ClassroomSchema.statics = {
  /**
   * Get classroom
   * @param {ObjectId} id - The objectId of classroom.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((classroom) => {
        if (classroom) {
          return classroom;
        }
        const err = new APIError('No such classroom exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get classroom
   * @param {ObjectId} id - The objectId of classroom.
   * @returns {Promise<User, APIError>}
   */
  getCached(id) {
    return this.findById(id)
      .cache(0, `ClassroomById-${id}`)
      .exec()
      .then((classroom) => {
        if (classroom) {
          return classroom;
        }
        const err = new APIError('No such classroom exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List classrooms in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of classrooms to be skipped.
   * @param {number} limit - Limit number of classrooms to be returned.
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
 * @typedef Classroom
 */
module.exports = mongoose.model('Classroom', ClassroomSchema, 'Classrooms');
