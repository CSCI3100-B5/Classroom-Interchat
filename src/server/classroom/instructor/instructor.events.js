const SocketValidatedEvents = require('../../helpers/socketValidatedEvents');
const paramValidation = require('./instructor.validation');
const instructorCtrl = require('./instructor.controller');

// instructor handles events related to instructor permission

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function externalEvents(socket, io) {
  const events = new SocketValidatedEvents(socket, io);

  events.on('request permission', paramValidation.requestPermission, instructorCtrl.requestPermission);

  events.on('cancel request permission', paramValidation.cancelRequestPermission, instructorCtrl.cancelRequestPermission);

  events.on('promote participant', paramValidation.promoteParticipant, instructorCtrl.promoteParticipant);

  events.on('award token', paramValidation.awardToken, instructorCtrl.awardToken);

  events.on('demote participant', paramValidation.demoteParticipant, instructorCtrl.demoteParticipant);

  events.on('mute participant', paramValidation.muteParticipant, instructorCtrl.muteParticipant);

  events.register();
};
