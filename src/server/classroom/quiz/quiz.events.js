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

  events.on('Answer SAQ', paramValidation.ansSAQuiz, quizCtrl.ansSAQuiz);

  events.register();
};
