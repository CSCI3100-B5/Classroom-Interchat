const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');
const Messages = require('../../models/message.model');
const APIError = require('../../helpers/APIError');

function notifyClassroomMetaChanged(classroom, io) {
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
    content: `Classroom created by ${meta.invoker.name}`,
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

// TODO: disallow if classroom closed
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
  if (classroom.closedAt) return callback({ error: 'This classroom is already closed' });
  let participant = classroom.participants.find(x => x.user._id.equals(meta.invoker._id));
  if (participant) {
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
  io.to(classroom.id).emit('participant changed', participant.filterSafe());
  callback({});
  classroom = await classroom.populate('host').populate('participants.user').populate('messages').execPopulate();
  // TODO: different handling when results are released
  const retClassroom = classroom.filterSafe();
  retClassroom.messages = await Promise.all(classroom.messages.map(async (x) => {
    if (x.type !== 'mcq' && x.type !== 'saq') return x.filterSafe();
    if (x.content.resultsReleased || x.sender._id.equals(meta.invoker._id)) {
      return (await x.populate('content.results').execPopulate()).filterSafe();
    }
    return x.filterWithoutAnswer();
  }));
  return socket.emit('catch up', retClassroom);
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
  classroom = await classroom.populate('host').populate('participants.user').execPopulate();
  const participant = classroom.participants.find(
    x => x.user._id.equals(socket.data.invoker._id)
  );
  if (!participant) return;
  const socketIds = io.sockets.adapter.rooms.get(`${socket.data.invoker.id}-${classroom.id}`);
  if (!socketIds || (socketIds && !Array.from(socketIds).some(x => x !== socket.id))) {
    participant.isOnline = false;
    participant.lastOnlineAt = Date.now();
    await classroom.save();
    cachegoose.clearCache(`ClassroomById-${classroom.id}`);
    // TODO: schedule a timeout to treat user as left
    notifyClassroomMetaChanged(classroom, io);
    io.to(classroom.id).emit('participant changed', participant.filterSafe());
  }
}

// TODO: implement leaving
async function leaveClassroom(packet, socket, io) {
  const [data, callback, meta] = packet;
  if (!socket.data.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  let classroom = meta.invokerClassroom;

  socket.emit('kick', { reason: 'Left classroom successfully' });

  socket.leave(classroom.id);
  socket.leave(`${meta.invoker.id}-${classroom.id}`);
  socket.data.invokerClassroom = null;

  const socketIds = io.sockets.adapter.rooms.get(`${meta.invoker.id}-${classroom.id}`);
  if (!socketIds || (socketIds && !socketIds.some(x => x !== socket.id))) {
    const idx = classroom.participants.findIndex(
      x => x.user._id.equals(meta.invoker._id)
    );
    classroom.participants.splice(idx, 1);
    const message = await Messages.Message.create({
      sender: null,
      type: 'text',
      content: `${meta.invoker.name} left`,
      classroom: classroom.id
    });
    classroom.messages.push(message);
    io.to(classroom.id).emit('new message', message.filterSafe());
    await classroom.save();

    classroom = await classroom.populate('host').populate('participants.user').execPopulate();
    io.to(classroom.id).emit('participant deleted', { userId: meta.invoker.id });
    // TODO: close classroom or transfer host if host leave
    if (meta.invoker.id === classroom.host.id) {
      if (classroom.participants.length > 0) {
        const instructors = classroom.participants.filter(x => x.permission === 'instructor');
        if (instructors.length === 0) {
          const student = [...classroom.participants].sort((a, b) => a.createdAt - b.createdAt)[0];
          await Classroom.updateOne(
            { _id: classroom.id, 'participants._id': student.id },
            { $set: { 'participants.$.permission': 'instructor' } }
          ).exec();
          classroom.host = student.user;
        } else {
          classroom.host = instructors.sort((a, b) => a.createdAt - b.createdAt)[0].user;
        }
        const message2 = await Messages.Message.create({
          sender: null,
          type: 'text',
          content: `${classroom.host.name} is now the host`,
          classroom: classroom.id
        });
        classroom.messages.push(message2);
        io.to(classroom.id).emit('new message', message2.filterSafe());
        await classroom.save();
        io.to(classroom.id).emit('participant changed', classroom.participants.find(x => x.user._id.equals(classroom.host._id)).filterSafe());
      } else {
        classroom.closedAt = Date.now();
        await classroom.save();
      }
    }
  }


  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  notifyClassroomMetaChanged(classroom, io);
  return callback({});
}

/**
 * kick a participant in the classroom
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function kickParticipant(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) {
    return callback({
      error: 'You are not in a classroom'
    });
  }

  let classroom = await meta.invokerClassroom.populate('participants.user').execPopulate();
  const participant = meta.invokerClassroom.participants.find(
    x => x.user._id.equals(meta.invoker._id)
  );
  if (participant.permission !== 'instructor') {
    return callback({
      error: 'Only instructors can kick participants'
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
  if (target.permission === 'instructor' && !classroom.host._id.equals(meta.invoker._id)) {
    return callback({
      error: 'You cannot kick an instructor'
    });
  }
  if (classroom.host._id.equals(meta.invoker._id) && meta.invoker.id === target.user.id) {
    return callback({
      error: 'You cannot kick yourself. Leave the classroom instead'
    });
  }


  const room = io.to(`${target.user.id}-${classroom.id}`);
  room.emit('kick', {
    reason: `You are kicked by ${meta.invoker.name}`
  });
  const socketIds = io.sockets.adapter.rooms.get(`${target.user.id}-${classroom.id}`);
  if (socketIds) {
    io.sockets.sockets.forEach((s) => {
      if (socketIds.has(s.id)) {
        s.data.invokerClassroom = null;
        s.leave(classroom.id);
        s.leave(`${target.user.id}-${classroom.id}`);
      }
    });
  }

  const idx = classroom.participants.findIndex(
    x => x.user._id.equals(target.user._id)
  );
  classroom.participants.splice(idx, 1);
  const message = await Messages.Message.create({
    sender: null,
    type: 'text',
    content: `${meta.invoker.name} kicked ${target.user.name}`,
    classroom: classroom.id
  });
  classroom.messages.push(message);
  io.to(classroom.id).emit('new message', message.filterSafe());
  await classroom.save();
  io.to(classroom.id).emit('participant deleted', { userId: target.user.id });


  classroom = await classroom.populate('host').execPopulate();

  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  notifyClassroomMetaChanged(classroom, io);
  return callback({});
}

module.exports = {
  createClassroom,
  peekClassroom,
  joinClassroom,
  lostConnection,
  leaveClassroom,
  kickParticipant
};
