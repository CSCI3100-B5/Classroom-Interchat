const Joi = require('joi');

module.exports = {
  cleanedValues: Joi.object({
    prompt: Joi.string().required(),
    type: Joi.string().valid('SAQ', 'MCQ').required(),
    choice: Joi.array().items(Joi.string().required()).required(),
    correct: Joi.array().items(Joi.number().required()),
    multiSelect: Joi.boolean()
  }),
  /*
  */
};
