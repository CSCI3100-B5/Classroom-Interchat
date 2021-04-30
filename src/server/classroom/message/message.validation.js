const Joi = require('joi');

module.exports = {
  sendMessage: Joi.object({
    message: Joi.string().trim().max(5000).required(),
    information: Joi.object({
      type: Joi.string().valid('text', 'question', 'reply').required(),
      qMessageId: Joi.string().hex().length(24),
    }).required()
  }),

  resolveQuestion: Joi.object({
    messageId: Joi.string().hex().length(24).required(),
  }),
};
