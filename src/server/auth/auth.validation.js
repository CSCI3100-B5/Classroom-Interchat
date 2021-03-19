const Joi = require('joi');

module.exports = {
  // POST /api/auth/login
  login: {
    body: Joi.object({
      username: Joi.string()
        .min(6).max(64)
        .regex(/[a-zA-Z][a-zA-Z0-9_-]+|[-_][a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*/)
        .required(),
      password: Joi.string().min(8).max(64).required()
    })
  },
  signup: {
    body: Joi.object({
      username: Joi.string()
        .min(6).max(64)
        .regex(/[a-zA-Z][a-zA-Z0-9_-]+|[-_][a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*/)
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(64).required(),
      userType: Joi.string().valid('STUDENT', 'INSTRUCTOR')
    })
  }
};
