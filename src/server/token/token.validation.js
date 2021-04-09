const Joi = require('joi');

module.exports = {
  invalidateToken: {
    params: Joi.object({
      tokenId: Joi.string().hex().required()
    })
  }
};
