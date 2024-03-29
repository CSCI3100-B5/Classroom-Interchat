const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { filterSafeOrOriginal } = require('./model-utils');

const { Schema } = mongoose;

// Database schema for a message and all its subtypes

/**
 * Message Schema
 */
const MessageSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom'
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, { discriminatorKey: 'type' });

MessageSchema.method({
  filterSafe() {
    if (this.type === 'mcq') {
      return {
        id: this.id,
        createdAt: this.createdAt,
        classroom: filterSafeOrOriginal(this.classroom),
        sender: filterSafeOrOriginal(this.sender),
        type: this.type,
        content: {
          prompt: this.content.prompt,
          choices: this.content.choices,
          correct: this.content.correct && this.content.correct.length > 0
            ? this.content.correct
            : null,
          multiSelect: this.content.multiSelect,
          closedAt: this.content.closedAt,
          results: filterSafeOrOriginal(this.content.results),
          resultsReleased: this.content.resultsReleased
        }
      };
    }
    if (this.type === 'saq') {
      return {
        id: this.id,
        createdAt: this.createdAt,
        classroom: filterSafeOrOriginal(this.classroom),
        sender: filterSafeOrOriginal(this.sender),
        type: this.type,
        content: {
          prompt: this.content.prompt,
          closedAt: this.content.closedAt,
          results: filterSafeOrOriginal(this.content.results),
          resultsReleased: this.content.resultsReleased
        }
      };
    }
    return {
      id: this.id,
      createdAt: this.createdAt,
      classroom: filterSafeOrOriginal(this.classroom),
      sender: filterSafeOrOriginal(this.sender),
      type: this.type,
      content: this.content
    };
  },
  filterWithoutAnswer() {
    if (this.type === 'mcq') {
      return {
        id: this.id,
        createdAt: this.createdAt,
        classroom: filterSafeOrOriginal(this.classroom),
        sender: filterSafeOrOriginal(this.sender),
        type: this.type,
        content: {
          prompt: this.content.prompt,
          choices: this.content.choices,
          multiSelect: this.content.multiSelect,
          closedAt: this.content.closedAt,
          resultsReleased: this.content.resultsReleased
        }
      };
    }
    if (this.type === 'saq') {
      return {
        id: this.id,
        createdAt: this.createdAt,
        classroom: filterSafeOrOriginal(this.classroom),
        sender: filterSafeOrOriginal(this.sender),
        type: this.type,
        content: {
          prompt: this.content.prompt,
          closedAt: this.content.closedAt,
          resultsReleased: this.content.resultsReleased
        }
      };
    }
    return this.filterSafe();
  }
});

/**
 * Statics
 */
MessageSchema.statics = {
  /**
   * Get message
   * @param {ObjectId} id - The objectId of message.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((message) => {
        if (message) {
          return message;
        }
        const err = new APIError('No such message exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(() => {
        const err = new APIError('No such message exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List message in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of message to be skipped.
   * @param {number} limit - Limit number of message to be returned.
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
 * @typedef Message
 */
const Message = mongoose.model('Message', MessageSchema, 'Messages');

const TextMessageSchema = new mongoose.Schema({
  content: {
    type: String
  }
});
const TextMessage = Message.discriminator('text', TextMessageSchema);

const QuestionMessage = Message.discriminator('question',
  new mongoose.Schema({
    content: {
      isResolved: {
        type: Boolean,
        default: false
      },
      content: {
        type: String
      }
    }
  }));

const ReplyMessage = Message.discriminator('reply',
  new mongoose.Schema({
    content: {
      replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'question'
      },
      content: {
        type: String
      }
    }
  }));

const MCQMessage = Message.discriminator('mcq',
  new mongoose.Schema({
    content: {
      prompt: {
        type: String
      },
      choices: [{
        type: String
      }],
      correct: [{
        type: Number,
      }],
      multiSelect: {
        type: Boolean
      },
      closedAt: {
        type: Date,
        default: null
      },
      results: [{
        type: Schema.Types.ObjectId,
        ref: 'QuizAnswer'
      }],
      resultsReleased: {
        type: Boolean,
        default: false
      }
    }
  }));

const SAQMessage = Message.discriminator('saq',
  new mongoose.Schema({
    content: {
      prompt: {
        type: String
      },
      closedAt: {
        type: Date,
        default: null
      },
      results: [{
        type: Schema.Types.ObjectId,
        ref: 'QuizAnswer'
      }],
      resultsReleased: {
        type: Boolean,
        default: false
      }
    }
  }));


module.exports = {
  Message,
  TextMessage,
  QuestionMessage,
  ReplyMessage,
  MCQMessage,
  SAQMessage
};
