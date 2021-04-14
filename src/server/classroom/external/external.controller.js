const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');
const Messages = require('../../models/message.model');

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

  // joining a closed classroom
  // send classroom history for viewing instead
  // not saving the classroom in the socket connection, so that
  // attempts to modify classroom contents will be rejected
  if (classroom.closedAt) {
    callback({});
    classroom = await classroom.populate('messages').populate('messages.sender').execPopulate();
    return socket.emit('catch up', classroom.filterSafe());
  }
  let participant = classroom.participants.find(x => x.user._id.equals(meta.invoker._id));
  if (participant) {
    if (!participant.isOnline) {
      participant.isOnline = true;
      await classroom.save();
    }
  } else {
    classroom.participants.push({
      user: meta.invoker,
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
  classroom = await classroom.populate('messages').execPopulate();
  classroom = await classroom.populate('messages.sender').execPopulate();
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

async function cleanupClassroom(classroomId, userId, lastOnline) {
  try {
    const classroom = await Classroom.get(classroomId);
    if (classroom.closedAt) return;
    if (classroom.participants.length > 1) return;
    const p = classroom.participants.find(x => x.user._id.toString() === userId);
    if (!p) return;
    if (p.isOnline) return;
    if (p.lastOnlineAt.getTime() === lastOnline.getTime()) {
      classroom.closedAt = new Date();
      classroom.participants.pull(p);
      await classroom.save();
    }
  } catch (ex) {
    // ignore errors
  }
}

// lostConnection updates the user's online status and notify others
// the user's participant entry is not removed, since the user is
// expected to reconnect
async function lostConnection(packet, socket, io) {
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

    // If the user is the last participant in the classroom
    // and remains disconnected for more than an hour,
    // close the classroom automatically
    if (classroom.participants.length === 1) {
      setTimeout(
        cleanupClassroom,
        1000 * 3600,
        classroom.id, socket.data.invoker.id, participant.lastOnlineAt
      );
    }

    notifyClassroomMetaChanged(classroom, io);
    io.to(classroom.id).emit('participant changed', participant.filterSafe());
  }
}

async function leaveClassroom(packet, socket, io) {
  const [data, callback, meta] = packet;
  if (!socket.data.invokerClassroom) return callback({ error: 'You are not in an open classroom' });
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
      error: 'You are not in an open classroom'
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
