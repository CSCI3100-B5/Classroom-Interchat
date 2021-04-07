const Joi = require('joi');

module.exports = {
  sendMessage: Joi.object({
    message: Joi.string().required(),
    information: {
      type: Joi.string().required(),
      qMessageID: Joi.string(),
    }
  }),
};
