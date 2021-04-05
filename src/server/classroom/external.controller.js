const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../models/classroom.model');
const Messages = require('../models/message.model');
const APIError = require('../helpers/APIError');

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function createClassroom(packet, socket, io) {
  const [data, meta] = packet;
  let classroom = await Classroom.create({
    name: data.name,
    host: meta.invoker.id,
    participants: [{
      user: meta.invoker.id,
      permission: 'instructor',
    }],
  });
  const message = await Messages.Message.create({
    sender: null,
    type: 'text',
    content: 'Classroom created',
    classroom: classroom.id
  });
  classroom.messages.push(message);
  await classroom.save();
  classroom = await classroom.populate('host').populate('participants.user').populate('messages').execPopulate();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  // TODO: emit classroom
  socket.emit('catch up', classroom.filterSafe());
}

/**
 * Return classroom metadata and subscribe user to subsequent classroom meta updates
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function peekClassroom(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (meta.invokerClassroom) {
    return callback({
      error: 'You cannot peek classroom when you have already joined one'
    });
  }

  if (socket.request.peekClassroom) {
    socket.leave(`peek-${socket.request.peekClassroom}`);
    socket.request.peekClassroom = null;
  }

  let classroom;
  try {
    classroom = await Classroom.getCached(data.classroomId);
    classroom = await classroom.populate('host').execPopulate();
  } catch (ex) {
    return callback({ error: ex.message });
  }
  socket.request.peekClassroom = classroom.id;
  socket.join(`peek-${socket.request.peekClassroom}`);
  return callback({
    value: {
      id: classroom.id,
      name: classroom.name,
      host: classroom.populated('host') ? classroom.host.filterSafe() : classroom.host,
      createdAt: classroom.createdAt,
      closedAt: classroom.closedAt,
      participantCount: classroom.participants.length,
    }
  });
}

module.exports = {
  createClassroom, peekClassroom
};
