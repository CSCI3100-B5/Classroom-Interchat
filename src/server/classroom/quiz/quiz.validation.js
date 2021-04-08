const Joi = require('joi');

module.exports = {
  cleanedValues: Joi.object({
    prompt: Joi.text().required(),
    type:Joi.string().valid('SAQ','MCQ').required(),
    choice:Joi.string().required(),
    correct:Joi.number().required(),
    //multiSelect:Joi.boolean().required()
  }),
  /*
  */
};

