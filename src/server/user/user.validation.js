const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: Joi.object({
      username: Joi.string()
        .min(6).max(64)
        .regex(/[a-zA-Z][a-zA-Z0-9_-]+|[-_][a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*/)
        .required(),
      password: Joi.string().min(8).max(64).required(),
      email: Joi.string().email().required(),
      userType: Joi.string().valid('STUDENT', 'INSTRUCTOR', 'ADMIN').default('STUDENT'),
      emailVerification: Joi.string().default('non-empty')
    })
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: Joi.object({
      username: Joi.string()
        .min(6).max(64)
        .regex(/[a-zA-Z][a-zA-Z0-9_-]+|[-_][a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*/),
      password: Joi.string().min(8).max(64),
      email: Joi.string().email(),
      userType: Joi.string().valid('STUDENT', 'INSTRUCTOR', 'ADMIN').default('STUDENT'),
      emailVerification: Joi.string()
    }),
    params: {
      userId: Joi.string().hex().required()
    }
  }
};
