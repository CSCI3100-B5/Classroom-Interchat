const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../models/classroom.model');
const Messages = require('../models/message.model');
const APIError = require('../helpers/APIError');

function notifyClassroomMetaChanged(classroom, io) {
  // TODO: notify others of this change
  io.to(`peek-${classroom.id}`).emit('peek update', {
    value: classroom.filterPeek()
  });
  io.to(classroom.id).emit('meta changed', classroom.filterMeta());
}

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function createClassroom(packet, socket, io) {
  const [data, callback, meta] = packet;
  if (meta.invokerClassroom) {
    return callback({
      error: 'You are already in a classroom'
    });
  }
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
  socket.data.invokerClassroom = classroom;
  // join the room that is unique to a specific user in a specific classroom
  // useful for hijacking connection to the same classroom with the same user account
  socket.join(`${socket.data.invoker.id}-${socket.data.invokerClassroom.id}`);
  socket.join(socket.data.invokerClassroom.id);
  callback({});
  // TODO: emit classroom
  return socket.emit('catch up', classroom.filterSafe());
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

  if (socket.data.peekClassroom) {
    socket.leave(`peek-${socket.data.peekClassroom}`);
    socket.data.peekClassroom = null;
  }

  let classroom;
  try {
    classroom = await Classroom.getCached(data.classroomId);
    classroom = await classroom.populate('host').execPopulate();
  } catch (ex) {
    return callback({ error: ex.message });
  }
  socket.data.peekClassroom = classroom.id;
  socket.join(`peek-${socket.data.peekClassroom}`);
  return callback({
    value: classroom.filterPeek()
  });
}

async function joinClassroom(packet, socket, io) {
  const [data, callback, meta] = packet;
  if (meta.invokerClassroom) return callback({ error: 'You are already in a classroom' });
  let classroom;
  try {
    classroom = await Classroom.getCached(data.classroomId);
    classroom = await classroom.populate('host').populate('participants.user').execPopulate();
  } catch (ex) {
    return callback({ error: ex.message });
  }
  let participant = classroom.participants.find(x => x.user._id.equals(meta.invoker._id));
  if (participant) {
    const room = io.to(`${meta.invoker.id}-${classroom.id}`);
    room.emit('kick', {
      reason: 'You are joining the same classroom from another device'
    });
    const socketIds = io.sockets.adapter.rooms.get(`${meta.invoker.id}-${classroom.id}`);
    if (socketIds) {
      io.sockets.sockets.forEach((s) => {
        if (socketIds.has(s.id)) {
          s.data.invokerClassroom = null;
          s.leave(classroom.id);
          s.leave(`${meta.invoker.id}-${classroom.id}`);
        }
      });
    }
    if (!participant.isOnline) {
      participant.isOnline = true;
      await classroom.save();
    }
  } else {
    classroom.participants.push({
      user: meta.invoker.id,
      permission: 'student'
    });
    const message = await Messages.Message.create({
      sender: null,
      type: 'text',
      content: `${meta.invoker.name} joined the classroom`,
      classroom: classroom.id
    });
    classroom.messages.push(message);
    io.to(classroom.id).emit('new message', message.filterSafe());
    await classroom.save();
    await classroom.populate('participants.user').execPopulate();
    participant = classroom.participants.find(x => x.user._id.equals(meta.invoker._id));
  }
  socket.data.invokerClassroom = classroom;
  socket.leave(`peek-${classroom.id}`);
  socket.join(`${socket.data.invoker.id}-${socket.data.invokerClassroom.id}`);
  socket.join(socket.data.invokerClassroom.id);
  socket.data.peekClassroom = null;
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  notifyClassroomMetaChanged(classroom, io);
  io.to(classroom.id).emit('new participant', participant.filterSafe());
  callback({});
  classroom = await classroom.populate('host').populate('participants.user').populate('messages').execPopulate();
  return socket.emit('catch up', classroom.filterSafe());
}


// lostConnection updates the user's online status and notify others
// the user's participant entry is not removed, since the user is
// expected to reconnect
async function lostConnection(packet, socket, io) {
  const [reason] = packet;
  if (!socket.data.invokerClassroom) return;
  let classroom = await Classroom.getCached(
    socket.data.invokerClassroom.id
  );
  classroom = await classroom.populate('host').execPopulate();
  const populated = classroom.populated('participants.user');
  const participant = classroom.participants.find(
    x => x.user._id.equals(socket.data.invoker._id)
  );
  if (!participant) return;
  participant.isOnline = false;
  participant.lastOnlineAt = Date.now();
  await classroom.save();
  // TODO: notify participant offline
  // TODO: should leave user-classroom room?
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  // TODO: schedule a timeout to treat user as left
  notifyClassroomMetaChanged(classroom, io);
}

// TODO: implement leaving


module.exports = {
  createClassroom,
  peekClassroom,
  joinClassroom,
  lostConnection
};
