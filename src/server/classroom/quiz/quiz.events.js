const SocketValidatedEvents = require('../../helpers/socketValidatedEvents');
const paramValidation = require('./quiz.validation');
const quizCtrl = require('./quiz.controller');

// message handles events related to messaging (normal/question/reply messages)

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function quizEvents(socket, io) {
  const events = new SocketValidatedEvents(socket, io);

  events.on('send quiz', paramValidation.sendQuiz, quizCtrl.sendQuiz);

  events.on('end quiz', paramValidation.endQuiz, quizCtrl.endQuiz);

  events.on('release results', paramValidation.releaseResults, quizCtrl.releaseResults);

  events.on('saq answer', paramValidation.ansSAQuiz, quizCtrl.ansSAQuiz);

  events.on('mcq answer', paramValidation.ansMCQuiz, quizCtrl.ansMCQuiz);

  events.register();
};
