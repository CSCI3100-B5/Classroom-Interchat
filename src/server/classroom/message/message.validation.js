const Joi = require('joi');

module.exports = {
  sendMessage: Joi.object({
    message: Joi.string().required(),
    information: {
      type: Joi.string().valid('text', 'question', 'reply').required(),
      qMessageId: Joi.string(),
    }
  }),

  resolveQuestion: Joi.object({
    messageId: Joi.string().required(),
  }),
};
