const Joi = require('joi');

module.exports = {
  requestPermission: Joi.object({
  }),
  cancelRequestPermission: Joi.object({
  }),
  promoteParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  }),
  awardToken: Joi.object({
    userIds: Joi.array().items(Joi.string().hex().length(24).required()).required(),
    value: Joi.string().allow('').default('').optional()
  })
};
