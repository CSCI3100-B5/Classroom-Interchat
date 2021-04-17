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
    value: Joi.string().trim().allow('').default('')
      .max(200)
      .optional()
  }),
  demoteParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  }),
  kickParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  }),
  muteParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  }),
  muteClassroom: Joi.object({}),
};
