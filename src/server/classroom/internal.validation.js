const Joi = require('joi');

module.exports = {
  sendMessage: Joi.object({
    message: Joi.string().required(),
  }),
};
