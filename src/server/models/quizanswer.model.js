const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { Schema } = mongoose;

/**
 * QuizAnswer Schema
 */
const QuizAnswerSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { discriminatorKey: 'type' });

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
  filterSafe() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      quiz: this.populated('quiz') ? this.quiz.filterSafe() : this.quiz,
      user: this.populated('user') ? this.user.filterSafe() : this.user,
      type: this.type,
      content: this.content
    };
  }
});

/**
 * Statics
 */
QuizAnswerSchema.statics = {
  /**
   * Get quiz answer
   * @param {ObjectId} id - The objectId of the quiz answer.
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
   * List quiz answers in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of quiz answers to be skipped.
   * @param {number} limit - Limit number of quiz answers to be returned.
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
const QuizAnswer = mongoose.model('QuizAnswer', QuizAnswerSchema, 'QuizAnswers');


const MCQAnswerSchema = new mongoose.Schema({
  content: [{
    type: Number,
    required: true
  }]
});

/**
 * @typedef MCQAnswer
 */
const MCQAnswer = QuizAnswer.discriminator('mcqanswer', MCQAnswerSchema);


const SAQAnswerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }
});

/**
 * @typedef SAQAnswer
 */
const SAQAnswer = QuizAnswer.discriminator('saqanswer', SAQAnswerSchema);

module.exports = {
  QuizAnswer,
  MCQAnswer,
  SAQAnswer
};
