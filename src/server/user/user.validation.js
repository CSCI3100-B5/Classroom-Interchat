const Joi = require('joi');

module.exports = {
  // POST /api/user
  createUser: {
    body: Joi.object({
      name: Joi.string().trim().min(5).max(100)
        .required(),
      password: Joi.string().min(8).max(64).required(),
      email: Joi.string().trim().email().required(),
      isAdmin: Joi.boolean().default(false),
      emailVerification: Joi.string().max(100).default('sample-code'),
      lastVerifiedEmail: Joi.string().email().default(null),
    })
  },

  // UPDATE /api/user/:userId
  updateUser: {
    body: Joi.object({
      name: Joi.string().trim().min(5).max(100),
      oldPassword: Joi.string().min(8).max(64),
      newPassword: Joi.string().min(8).max(64),
      email: Joi.string().trim().email()
    }),
    params: Joi.object({
      userId: Joi.string().hex().length(24).required()
    })
  }
};
