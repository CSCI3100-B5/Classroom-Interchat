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
  console.log(packet);
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

module.exports = {
  createClassroom
};
