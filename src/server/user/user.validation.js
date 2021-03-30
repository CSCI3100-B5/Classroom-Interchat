const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: Joi.object({
      name: Joi.string().min(5).max(100).required(),
      password: Joi.string().min(8).max(64).required(),
      email: Joi.string().email().required(),
      userType: Joi.string().valid('STUDENT', 'INSTRUCTOR', 'ADMIN').default('STUDENT'),
      emailVerification: Joi.string().default('non-empty')
    })
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: Joi.object({
      name: Joi.string().min(5).max(100),
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
