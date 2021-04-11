const SocketValidatedEvents = require('../../helpers/socketValidatedEvents');
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

  events.on('peek classroom', paramValidation.peekClassroom, externalCtrl.peekClassroom);

  events.on('join classroom', paramValidation.joinClassroom, externalCtrl.joinClassroom);

  events.on('disconnect', externalCtrl.lostConnection);

  events.on('leave classroom', externalCtrl.leaveClassroom);

  events.on('reconnect', console.log);

  events.on('kick participant', paramValidation.kickParticipant, externalCtrl.kickParticipant);

  events.register();
};
