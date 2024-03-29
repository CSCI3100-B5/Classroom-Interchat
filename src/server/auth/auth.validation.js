const Joi = require('joi');

module.exports = {
  login: {
    body: Joi.object({
      email: Joi.string().trim().email().required(),
      password: Joi.string().min(8).max(64).required()
    })
  },
  signup: {
    body: Joi.object({
      name: Joi.string().trim().min(5).max(100)
        .required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().min(8).max(64).required()
    })
  },
  verifyEmail: {
    params: Joi.object({
      userId: Joi.string().hex().length(24).required(),
      verification: Joi.string().max(100).required()
    })
  }
};
