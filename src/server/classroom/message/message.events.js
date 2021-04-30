const SocketValidatedEvents = require('../../helpers/socketValidatedEvents');
const paramValidation = require('./message.validation');
const messageCtrl = require('./message.controller');

/**
 * handles events related to messaging (normal/question/reply messages)
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function messageEvents(socket, io) {
  const events = new SocketValidatedEvents(socket, io);

  events.on('send message', paramValidation.sendMessage, messageCtrl.sendMessage);

  events.on('resolve question', paramValidation.resolveQuestion, messageCtrl.resolveQuestion);

  events.register();
};
