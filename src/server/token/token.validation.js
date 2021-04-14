const Joi = require('joi');

module.exports = {
  getTokens: {
    params: Joi.object({
      userId: Joi.string().hex().length(24).required()
    })
  },
  invalidateToken: {
    params: Joi.object({
      tokenId: Joi.string().hex().length(24).required()
    })
  }
};
