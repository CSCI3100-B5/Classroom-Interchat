const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../models/classroom.model');
const Messages = require('../models/message.model');
const APIError = require('../helpers/APIError');

/**
 *
 * @param {*} data
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function createClassroom(data, socket, io) {
  let classroom = await Classroom.create({
    name: data.payload.name,
    host: data.invoker.id,
    participants: [{
      user: data.invoker.id,
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
