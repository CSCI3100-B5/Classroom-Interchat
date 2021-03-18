const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    }),
    params: {
      userId: Joi.string().hex().required()
    }
  }
};
