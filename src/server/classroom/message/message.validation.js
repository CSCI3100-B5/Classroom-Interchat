const Joi = require('joi');

module.exports = {
  sendMessage: Joi.object({
    message: Joi.string().required(),
  }),

  sendQuestionMessage: Joi.object({
    message: Joi.string().required(),
  }),

  sendReplyMessage: Joi.object({
    message: Joi.string().required(),
    qMessageID: Joi.string().required(),
  }),

};
