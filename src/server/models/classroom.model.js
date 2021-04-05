const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { Schema } = mongoose;

/**
 * Classroom Schema
 */
const ClassroomSchema = new Schema({
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
  closedAt: {
    type: Date,
    default: null
  },
  participants: [new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['instructor', 'student', 'requesting']
    },
    isMuted: {
      type: Boolean,
      default: false
    }
  })],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
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
  filterSafe() {
    return {
      id: this.id,
      name: this.name,
      host: this.populated('host') ? this.host.filterSafe() : this.host,
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      participants: this.participants.map(x => ({
        user: this.populated('participants.user') ? x.user.filterSafe() : x.user,
        permission: x.permission,
        isMuted: x.isMuted
      })),
      messages: this.populated('messages') ? this.messages.map(x => x.filterSafe()) : this.messages,
      isMuted: this.isMuted
    };
  }
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
