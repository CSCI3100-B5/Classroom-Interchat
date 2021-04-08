const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');
const Messages = require('../../models/message.model');
const APIError = require('../../helpers/APIError');

/**
 * Mark a participant's permission as requesting
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function requestPermission(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in a classroom'
    });
  }

  const classroom = await meta.invokerClassroom.populate('participants.user').execPopulate();
  const participant = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (participant.permission === 'instructor') {
    return callback({
      error: 'You are already an instructor'
    });
  }

  await Classroom.updateOne(
    { _id: classroom.id, 'participants._id': participant.id },
    { $set: { 'participants.$.permission': 'requesting' } }
  ).exec();
  participant.permission = 'requesting';
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);

  io.to(classroom.id).emit('participant changed', participant.filterSafe());

  return callback({});
}

/**
 * Mark a participant's permission as student
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function cancelRequestPermission(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in a classroom'
    });
  }

  const classroom = await meta.invokerClassroom.populate('participants.user').execPopulate();
  const participant = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (participant.permission !== 'requesting') {
    return callback({
      error: 'You are not currently requesting for permission'
    });
  }

  await Classroom.updateOne(
    { _id: classroom.id, 'participants._id': participant.id },
    { $set: { 'participants.$.permission': 'student' } }
  ).exec();
  participant.permission = 'student';
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);

  io.to(classroom.id).emit('participant changed', participant.filterSafe());

  return callback({});
}

/**
 * Mark a participant's permission as instructor
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function promoteParticipant(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in a classroom'
    });
  }

  const classroom = await meta.invokerClassroom.populate('participants.user').execPopulate();
  const requestor = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (requestor.permission !== 'instructor') {
    return callback({
      error: 'You need to be an instructor to do this'
    });
  }
  const participant = meta.invokerClassroom.participants.find(
    x => x.user._id.toString() === data.userId
  );
  if (!participant) {
    return callback({
      error: 'The specified user is not a participant of this classroom'
    });
  }
  if (participant.permission === 'instructor') {
    return callback({
      error: 'The specified user is already an instructor'
    });
  }

  await Classroom.updateOne(
    { _id: classroom.id, 'participants._id': participant.id },
    { $set: { 'participants.$.permission': 'instructor' } }
  ).exec();
  participant.permission = 'instructor';

  const message = await Messages.Message.create({
    sender: null,
    type: 'text',
    content: `${meta.invoker.name} promoted ${participant.user.name} to an instructor`,
    classroom: classroom.id
  });
  classroom.messages.push(message);
  io.to(classroom.id).emit('new message', message.filterSafe());
  await classroom.save();

  cachegoose.clearCache(`ClassroomById-${classroom.id}`);

  io.to(classroom.id).emit('participant changed', participant.filterSafe());

  return callback({});
}

module.exports = {
  requestPermission,
  cancelRequestPermission,
  promoteParticipant
};
