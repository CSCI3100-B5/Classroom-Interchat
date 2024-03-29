const httpStatus = require('http-status');
const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');
const Messages = require('../../models/message.model');
const User = require('../../models/user.model');
const Token = require('../../models/token.model');
const APIError = require('../../helpers/APIError');

/**
 * Mark a participant's permission as requesting
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function requestPermission(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
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
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function cancelRequestPermission(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
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
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function promoteParticipant(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
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

/**
 * Award a token to all the given user ids
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function awardToken(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
    });
  }

  const requestor = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (requestor.permission !== 'instructor') {
    return callback({
      error: 'You need to be an instructor to do this'
    });
  }

  let users;
  try {
    users = await User.find({
      _id: {
        $in: data.userIds.map(x => mongoose.Types.ObjectId(x))
      }
    }).exec();
  } catch (ex) {
    return callback({ error: ex });
  }

  if (!users || users.length === 0) {
    return callback({ error: 'There are no user to be awarded a token to' });
  }

  await Token.insertMany(users.map(x => ({
    createdBy: meta.invoker.id,
    receivedBy: x.id,
    classroom: meta.invokerClassroom.id,
    value: data.value ?? null
  })));

  return callback({});
}


/**
 * Mark a participant's permission as student
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function demoteParticipant(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
    });
  }

  const classroom = await meta.invokerClassroom.populate('participants.user').execPopulate();
  if (!classroom.host._id.equals(meta.invoker._id)) {
    return callback({
      error: 'You need to be the host to do this'
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
  if (participant.permission === 'student') {
    return callback({
      error: 'A student cannot be demoted'
    });
  }
  if (data.userId === classroom.host._id.toString()) {
    return callback({
      error: 'The host cannot be demoted'
    });
  }

  const isRequesting = participant.permission === 'requesting';

  await Classroom.updateOne(
    { _id: classroom.id, 'participants._id': participant.id },
    { $set: { 'participants.$.permission': 'student' } }
  ).exec();
  participant.permission = 'student';

  if (!isRequesting) {
    const message = await Messages.Message.create({
      sender: null,
      type: 'text',
      content: `${meta.invoker.name} demoted ${participant.user.name} to a student`,
      classroom: classroom.id
    });
    classroom.messages.push(message);
    io.to(classroom.id).emit('new message', message.filterSafe());
  }
  await classroom.save();

  cachegoose.clearCache(`ClassroomById-${classroom.id}`);

  io.to(classroom.id).emit('participant changed', participant.filterSafe());

  return callback({});
}


/**
 * Mute a participant in the classroom
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function muteParticipant(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
    });
  }

  const classroom = await meta.invokerClassroom.populate('participants.user').execPopulate();
  const participant = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (participant.permission !== 'instructor') {
    return callback({
      error: 'Only instructors can toggle mute on participants'
    });
  }
  const target = meta.invokerClassroom.participants.find(
    x => x.user.id === data.userId
  );
  if (!target) {
    return callback({
      error: 'Targeted user is not in this classroom'
    });
  }

  const newValue = !target.isMuted;
  await Classroom.updateOne(
    { _id: classroom.id, 'participants._id': target.id },
    { $set: { 'participants.$.isMuted': newValue } }
  ).exec();
  target.isMuted = newValue;

  await classroom.save();

  cachegoose.clearCache(`ClassroomById-${classroom.id}`);

  io.to(classroom.id).emit('participant changed', target.filterSafe());

  return callback({});
}


/**
 * Mute the entire classroom
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function muteClassroom(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in an open classroom'
    });
  }

  const classroom = await meta.invokerClassroom.populate('participants.user').populate('host').execPopulate();
  const participant = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (participant.permission !== 'instructor') {
    return callback({
      error: 'Only instructors can toggle mute on the entire classroom'
    });
  }

  classroom.isMuted = !classroom.isMuted;

  await classroom.save();

  cachegoose.clearCache(`ClassroomById-${classroom.id}`);

  io.to(classroom.id).emit('meta changed', classroom.filterMeta());

  return callback({});
}


module.exports = {
  requestPermission,
  cancelRequestPermission,
  promoteParticipant,
  awardToken,
  demoteParticipant,
  muteParticipant,
  muteClassroom
};
