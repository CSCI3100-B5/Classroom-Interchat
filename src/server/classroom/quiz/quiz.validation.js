const Joi = require('joi');

module.exports = {
  sendQuiz: Joi.object({
    prompt: Joi.string().required(),
    type: Joi.string().valid('SAQ', 'MCQ').required(),
    choices: Joi.array().items(Joi.string().required()),
    correct: Joi.array().items(Joi.number().required()),
    multiSelect: Joi.boolean()
  }),
  endQuiz: Joi.string().hex().required(),
  // MCQ
  /*   convert choices to an array if it isn't already one
    if (!(values.choices instanceof Array)) {
      values.choices = [values.choices]; // eslint-disable-line no-param-reassign
    }
  */
  values: Joi.object({
    choices: Joi.array().items(Joi.string().required()).required(),
  }),
  // SAQ
  /*
    const data = useStates({
    answer: ''
  });
  */
  ansSAQuiz: Joi.object({
    answer: Joi.string().required(),
  }),
};
