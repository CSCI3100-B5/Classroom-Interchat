const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { Schema } = mongoose;

/**
 * QuizAnswer Schema
 * QuizAnswer object
{
  "id": "<quizanswer id>",
  "quiz": "<REF message id>",
  "createdAt": "<timestamp>",
  "content": "<string>" | [ number ]
}
 */
const QuizAnswerSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  content: [{
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
QuizAnswerSchema.method({

});

/**
 * Statics
 */
QuizAnswerSchema.statics = {
  /**
   * Get QuizAnswer
   * @param {ObjectId} id - The objectId of QuizAnswer.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((quizanswer) => {
        if (quizanswer) {
          return quizanswer;
        }
        const err = new APIError('No such quizanswer exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List quizanswers in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of quizanswers to be skipped.
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
 * @typedef QuizAnswer
 */
module.exports = mongoose.model('QuizAnswer', QuizAnswerSchema, 'QuizAnswers');
