const Joi = require('joi');

module.exports = {
  createClassroom: Joi.object({
    name: Joi.string().trim().max(200).required(),
  }),
  peekClassroom: Joi.object({
    classroomId: Joi.string().hex().length(24).required()
  }),
  joinClassroom: Joi.object({
    classroomId: Joi.string().hex().length(24).required()
  }),
  kickParticipant: Joi.object({
    userId: Joi.string().hex().length(24).required()
  })
};
