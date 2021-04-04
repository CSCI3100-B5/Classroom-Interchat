const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { Schema } = mongoose;

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
    return {
      id: this.id,
      createdAt: this.createdAt,
      classroom: this.populated('classroom') ? this.classroom.filterSafe() : this.classroom,
      sender: this.populated('sender') ? this.sender.filterSafe() : this.sender,
      type: this.type,
      content: this.content
    };
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
      });
  },

  /**
   * Get message
   * @param {ObjectId} id - The objectId of message.
   * @returns {Promise<User, APIError>}
   */
  getCached(id) {
    return this.findById(id)
      .cache(0, `MessageById-${id}`)
      .exec()
      .then((message) => {
        if (message) {
          return message;
        }
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
      }
    }
  }));

const SAQMessage = Message.discriminator('saq',
  new mongoose.Schema({
    content: {
      prompt: {
        type: String
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
