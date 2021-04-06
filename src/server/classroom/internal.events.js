const SocketValidatedEvents = require('../helpers/socketValidatedEvents');
const paramValidation = require('./internal.validation');
const internalCtrl = require('./internal.controller');

// internal handles events after the user join a classroom

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function internalEvents(socket, io) {
  const events = new SocketValidatedEvents(socket, io);

  events.on('send message', paramValidation.sendMessage, internalCtrl.sendMessage);

  events.register();
};
