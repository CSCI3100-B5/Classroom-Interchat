const Joi = require('joi');

// TODO: GUIDE: you may copy this file to make your xxx.validation.js
// For more info on how to write Joi schemas, see https://joi.dev/api/

module.exports = {
  // POST /api/user
  createUser: {
    body: Joi.object({
      name: Joi.string().min(5).max(100).required(),
      password: Joi.string().min(8).max(64).required(),
      email: Joi.string().email().required(),
      isAdmin: Joi.boolean().default(false),
      emailVerification: Joi.string().default('sample-code'),
      lastVerifiedEmail: Joi.string().email().default(null),
    })
  },

  // UPDATE /api/user/:userId
  updateUser: {
    body: Joi.object({
      name: Joi.string().min(5).max(100),
      password: Joi.string().min(8).max(64),
      email: Joi.string().email()
    }),
    params: Joi.object({
      userId: Joi.string().hex().required()
    })
  }
};
