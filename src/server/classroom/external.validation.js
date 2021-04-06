const Joi = require('joi');

module.exports = {
  createClassroom: Joi.object({
    name: Joi.string().required(),
  }),
  peekClassroom: Joi.object({
    classroomId: Joi.string().hex().length(24).required()
  }),
  joinClassroom: Joi.object({
    classroomId: Joi.string().hex().length(24).required()
  })
};
