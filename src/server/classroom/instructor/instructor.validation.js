const Joi = require('joi');

module.exports = {
  requestPermission: Joi.object({
  }),
  cancelRequestPermission: Joi.object({
  }),
  promoteParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  }),
  demoteParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  }),
  kickParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  })
};