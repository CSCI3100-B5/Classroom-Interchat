const Joi = require('joi');

module.exports = {
  createClassroom: Joi.object({
    name: Joi.string().required(),
  }),
};
