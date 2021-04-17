const Joi = require('joi');

module.exports = {
  sendQuiz: Joi.object({
    prompt: Joi.string().trim().max(5000).required(),
    type: Joi.string().valid('SAQ', 'MCQ').required(),
    choices: Joi.array().items(Joi.string().trim().max(200).required()),
    correct: Joi.array().items(Joi.number().required()),
    multiSelect: Joi.boolean()
  }),
  endQuiz: Joi.object({
    messageId: Joi.string().hex().length(24).required(),
  }),
  releaseResults: Joi.object({
    messageId: Joi.string().hex().length(24).required(),
  }),
  ansSAQuiz: Joi.object({
    content: Joi.string().trim().max(200).required(),
    messageId: Joi.string().hex().length(24).required(),
  }),
  ansMCQuiz: Joi.object({
    content: Joi.array().items(Joi.number().required()).required(),
    messageId: Joi.string().hex().length(24).required(),
  }),
};
