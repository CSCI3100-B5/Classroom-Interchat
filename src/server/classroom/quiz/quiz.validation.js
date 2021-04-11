const Joi = require('joi');

module.exports = {
  sendQuiz: Joi.object({
    prompt: Joi.string().required(),
    type: Joi.string().valid('SAQ', 'MCQ').required(),
    choices: Joi.array().items(Joi.string().required()),
    correct: Joi.array().items(Joi.number().required()),
    multiSelect: Joi.boolean()
  }),
  endQuiz: Joi.object({
    messageId: Joi.string().hex().required(),
  }),
  releaseResults: Joi.object({
    messageId: Joi.string().hex().required(),
  }),
  ansSAQuiz: Joi.object({
    content: Joi.string().required(),
    messageId: Joi.string().hex().length(24).required(),
  }),
  ansMCQuiz: Joi.object({
    content: Joi.array().items(Joi.number().required()).required(),
    messageId: Joi.string().hex().length(24).required(),
  }),
};
