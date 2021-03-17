const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: Joi.object({
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{7}$/).required()
    })
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: Joi.object({
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{7}$/).required()
    }),
    params: {
      userId: Joi.string().hex().required()
    }
  }
};
