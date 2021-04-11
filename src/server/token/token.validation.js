const Joi = require('joi');

module.exports = {
  getTokens: {
    params: Joi.object({
      userId: Joi.string().hex().required()
    })
  },
  invalidateToken: {
    params: Joi.object({
      tokenId: Joi.string().hex().required()
    })
  }
};
