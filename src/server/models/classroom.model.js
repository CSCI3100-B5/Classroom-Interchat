const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { filterSafeOrOriginal } = require('./model-utils');

const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  permission: {
    type: String,
    enum: ['instructor', 'student', 'requesting']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  lastOnlineAt: {
    type: Date,
    default: Date.now
  },
  isMuted: {
    type: Boolean,
    default: false
  }
});

ParticipantSchema.method({
  filterSafe() {
    return {
      id: this.id,
      user: filterSafeOrOriginal(this.user),
      permission: this.permission,
      createdAt: this.createdAt,
      isOnline: this.isOnline,
      lastOnlineAt: this.lastOnlineAt,
      isMuted: this.isMuted
    };
  }
});

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
  participants: [ParticipantSchema],
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
      host: filterSafeOrOriginal(this.host),
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      participants: this.participants.map(x => x.filterSafe()),
      messages: filterSafeOrOriginal(this.messages),
      isMuted: this.isMuted
    };
  },
  filterMeta() {
    return {
      id: this.id,
      name: this.name,
      host: filterSafeOrOriginal(this.host),
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      isMuted: this.isMuted
    };
  },
  filterPeek() {
    return {
      ...this.filterMeta(),
      participantCount: this.participants.reduce(
        (accu, curr) => accu + (curr.isOnline ? 1 : 0),
        0
      ),
    };
  },
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
      })
      .catch(() => {
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
      })
      .catch(() => {
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
