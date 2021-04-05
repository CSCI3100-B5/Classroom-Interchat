const SocketValidatedEvents = require('../helpers/socketValidatedEvents');
const paramValidation = require('./external.validation');
const externalCtrl = require('./external.controller');

// external handles events when the user hasn't joined a classroom yet

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function externalEvents(socket, io) {
  const events = new SocketValidatedEvents(socket, io);

  events.on('create classroom', paramValidation.createClassroom, externalCtrl.createClassroom);

  setInterval(() => socket.emit('Ping', {}));

  events.register();
};
